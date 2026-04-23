/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://percy.io/api/v1';
const REPORT_DIR = path.join(process.cwd(), 'ai-debug-report');
const REPORT_FILE = path.join(REPORT_DIR, 'percy-review-report.md');
const REPORT_ENV_FILE = path.join(REPORT_DIR, 'percy-review-report.env');

const token = process.env.PERCY_API_TOKEN || process.env.PERCY_TOKEN;
const hasApiToken = !!process.env.PERCY_API_TOKEN;
const projectSlug = process.env.PERCY_PROJECT || 'opentext/opentext-tta';
const sha = process.env.GITHUB_SHA;
const branch = process.env.GITHUB_REF_NAME;
const runUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;

function asPercent(raw) {
  if (raw === null || raw === undefined || Number.isNaN(Number(raw))) {
    return null;
  }
  return Number(raw) * 100;
}

function percentText(value) {
  return value === null ? 'N/A' : `${value.toFixed(2)}%`;
}

function classifySnapshot(name) {
  const noisePattern =
    /(cookie|onetrust|chat|agent|assistant|summit|region|popup|floating|overlay|widget)/i;
  return noisePattern.test(name) ? 'dynamic-noise-likely' : 'core-ui-or-content';
}

function snapshotRecommendation(classification, maxDiffPercent, reviewStateReason) {
  if (reviewStateReason === 'no_diffs' || maxDiffPercent === 0) {
    return 'APPROVE_SAFE';
  }
  if (classification === 'dynamic-noise-likely' && maxDiffPercent !== null && maxDiffPercent <= 2.0) {
    return 'APPROVE_SAFE';
  }
  if (classification === 'core-ui-or-content' && maxDiffPercent !== null && maxDiffPercent > 0.5) {
    return 'REJECT';
  }
  return 'REVIEW_REQUIRED';
}

async function percyGet(pathname, query = {}) {
  const url = new URL(`${API_BASE}${pathname}`);
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}`.length > 0) {
      url.searchParams.set(k, `${v}`);
    }
  });

  const res = await fetch(url, {
    headers: {
      Authorization: `Token token=${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    let errorMessage = `Percy API ${res.status} ${res.statusText}: ${body.slice(0, 500)}`;
    
    if (res.status === 403) {
      const isProjectToken = token?.startsWith('web_');
      errorMessage += `\n\n[PROBABLE CAUSE] A 403 Forbidden error usually indicates that the PERCY_TOKEN being used is a 'Project Token' (Write-only). ` +
                      `To read build data via the API, you should ideally use an 'Organization API Token' as PERCY_API_TOKEN. ` +
                      `Current token starts with: ${token ? token.slice(0, 8) + '...' : 'MISSING'}`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

function deriveBuildRecommendation(rows, buildAttributes) {
  if (buildAttributes['failed-snapshots-count'] > 0 || buildAttributes['failure-reason']) {
    return 'REJECT - BUILD FAILURE';
  }
  if (rows.some((r) => r.recommendation === 'REJECT')) {
    return 'REJECT - REGRESSION SUSPECTED';
  }
  if (rows.some((r) => r.recommendation === 'REVIEW_REQUIRED')) {
    return 'REVIEW REQUIRED';
  }
  return 'AUTO-APPROVE SAFE';
}

function markdownTable(rows) {
  const header =
    '| Snapshot | Review State | Max Diff | Classification | Recommendation |\n|---|---|---:|---|---|';
  const body = rows
    .map(
      (r) =>
        `| ${r.name.replaceAll('|', '\\|')} | ${r.reviewState} (${r.reviewReason}) | ${percentText(
          r.maxDiffPercent,
        )} | ${r.classification} | ${r.recommendation} |`,
    )
    .join('\n');
  return `${header}\n${body}`;
}

async function getAllSnapshots(buildId) {
  const all = [];
  let cursor = null;
  while (true) {
    const payload = await percyGet('/snapshots', {
      build_id: buildId,
      'page[limit]': 30,
      ...(cursor ? { 'page[cursor]': cursor } : {}),
    });
    const data = payload.data || [];
    const included = payload.included || [];
    const comparisons = new Map(
      included.filter((item) => item.type === 'comparisons').map((item) => [item.id, item.attributes || {}]),
    );

    data.forEach((snapshot) => {
      const attrs = snapshot.attributes || {};
      const comparisonRefs = snapshot.relationships?.comparisons?.data || [];
      const diffValues = comparisonRefs
        .map((ref) => comparisons.get(ref.id))
        .filter(Boolean)
        .map((compAttrs) =>
          asPercent(compAttrs['ai-diff-ratio'] ?? compAttrs['diff-ratio'] ?? compAttrs['diff-ratio-wo-context-diff']),
        )
        .filter((v) => v !== null);

      const maxDiffPercent = diffValues.length ? Math.max(...diffValues) : null;
      const classification = classifySnapshot(attrs.name || snapshot.id);
      const recommendation = snapshotRecommendation(
        classification,
        maxDiffPercent,
        attrs['review-state-reason'] || 'unknown',
      );

      all.push({
        name: attrs.name || `snapshot-${snapshot.id}`,
        reviewState: attrs['review-state'] || 'unknown',
        reviewReason: attrs['review-state-reason'] || 'unknown',
        maxDiffPercent,
        classification,
        recommendation,
      });
    });

    if (data.length < 30) {
      break;
    }
    cursor = data[data.length - 1].id;
  }
  return all;
}

function buildMarkdown(build, rows, recommendation) {
  const attrs = build.attributes || {};
  const approveLink = build.meta?.['approve-link']
    ? `https://percy.io${build.meta['approve-link']}`
    : 'N/A';

  const changedRows = rows
    .filter((r) => !['all_snapshots_approved', 'all_snapshots_approved_previously', 'no_diffs'].includes(r.reviewReason))
    .sort((a, b) => (b.maxDiffPercent || -1) - (a.maxDiffPercent || -1));

  const shownRows = changedRows.slice(0, 25);
  const totals = {
    approveSafe: rows.filter((r) => r.recommendation === 'APPROVE_SAFE').length,
    review: rows.filter((r) => r.recommendation === 'REVIEW_REQUIRED').length,
    reject: rows.filter((r) => r.recommendation === 'REJECT').length,
  };

  return [
    '# Percy Automated Review Report',
    '',
    `- **Run URL:** ${runUrl}`,
    `- **Percy Build URL:** ${attrs['web-url'] || 'N/A'}`,
    `- **Percy Build ID:** ${build.id}`,
    `- **Branch/SHA:** ${attrs.branch || branch || 'N/A'} / ${(sha || '').slice(0, 8) || 'N/A'}`,
    `- **Build State:** ${attrs.state || 'unknown'}`,
    `- **Review State:** ${attrs['review-state'] || 'unknown'}`,
    `- **Snapshots:** total=${attrs['total-snapshots'] ?? 'N/A'}, unreviewed=${attrs['total-snapshots-unreviewed'] ?? 'N/A'}, changed-comparisons=${attrs['total-comparisons-diff'] ?? 'N/A'}`,
    `- **Recommendation:** **${recommendation}**`,
    `- **Approve API link:** ${approveLink}`,
    '',
    '## Decision Counts',
    '',
    `- APPROVE_SAFE: ${totals.approveSafe}`,
    `- REVIEW_REQUIRED: ${totals.review}`,
    `- REJECT: ${totals.reject}`,
    '',
    '## Snapshot Triage',
    '',
    shownRows.length ? markdownTable(shownRows) : '_No changed/unreviewed snapshots to triage._',
    '',
    '> Rule set: core UI diffs > 0.50% => reject suggestion; dynamic/noise widgets <= 2.00% => approve-safe suggestion.',
    '',
  ].join('\n');
}

async function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  console.log('--- Percy API Diagnostics ---');
  console.log(`- PERCY_API_TOKEN present: ${hasApiToken}`);
  console.log(`- Token type: ${token?.startsWith('web_') ? 'Project Token (Write-Only)' : 'API/Org Token (Read/Write)'}`);
  console.log(`- Token prefix: ${token ? token.slice(0, 8) + '...' : 'MISSING'}`);
  console.log('----------------------------');

  if (!token) {
    const message = '# Percy Automated Review Report\n\nPERCY_TOKEN is missing. Unable to fetch Percy API data.\n';
    fs.writeFileSync(REPORT_FILE, message, 'utf8');
    fs.writeFileSync(
      REPORT_ENV_FILE,
      ['PERCY_BUILD_ID=', 'PERCY_BUILD_URL=', 'PERCY_APPROVE_LINK=', 'PERCY_RECOMMENDATION=REVIEW REQUIRED'].join(
        '\n',
      ),
      'utf8',
    );
    console.log(message);
    return;
  }

  let build = null;
  const buildIdFile = path.join(process.cwd(), 'percy_build_id.txt');
  
  if (fs.existsSync(buildIdFile)) {
    const buildId = fs.readFileSync(buildIdFile, 'utf8').trim();
    if (buildId) {
      console.log(`Found Percy Build ID in file: ${buildId}. Fetching directly...`);
      const buildPayload = await percyGet(`/builds/${buildId}`).catch(err => {
        console.warn(`Failed to fetch build ${buildId} directly: ${err.message}`);
        return null;
      });
      if (buildPayload && buildPayload.data) {
        build = buildPayload.data;
      }
    }
  }

  if (!build) {
    console.log('No Build ID file found or fetch failed, searching via API...');
    // Try searching for builds within the specific project first (more compatible with Project Tokens)
    const buildsPayload = await percyGet(`/projects/${encodeURIComponent(projectSlug)}/builds`, {
      'filter[sha]': sha,
      'filter[branch]': branch,
      'page[limit]': 30,
    }).catch(async (err) => {
      // If project-specific fails with 404/403, fallback to global builds search (requires Org token)
      if (err.message.includes('403') || err.message.includes('404')) {
        console.warn(`Project-specific build search failed for ${projectSlug}, falling back to global search...`);
        return percyGet('/builds', {
          'filter[sha]': sha,
          'filter[branch]': branch,
          'page[limit]': 30,
        });
      }
      throw err;
    });

    const builds = buildsPayload.data || [];
    if (!builds.length) {
      const message = `# Percy Automated Review Report\n\nNo Percy build found for SHA \`${sha}\` on branch \`${branch}\`.\n`;
      fs.writeFileSync(REPORT_FILE, message, 'utf8');
      fs.writeFileSync(
        REPORT_ENV_FILE,
        ['PERCY_BUILD_ID=', 'PERCY_BUILD_URL=', 'PERCY_APPROVE_LINK=', 'PERCY_RECOMMENDATION=REVIEW REQUIRED'].join(
          '\n',
        ),
        'utf8',
      );
      console.log(message);
      return;
    }
    build = builds[0];
  }
  const rows = await getAllSnapshots(build.id);
  const recommendation = deriveBuildRecommendation(rows, build.attributes || {});
  const markdown = buildMarkdown(build, rows, recommendation);
  const approveLink = build.meta?.['approve-link'] ? `https://percy.io${build.meta['approve-link']}` : '';
  const buildUrl = build.attributes?.['web-url'] || '';

  fs.writeFileSync(REPORT_FILE, markdown, 'utf8');
  fs.writeFileSync(
    REPORT_ENV_FILE,
    [
      `PERCY_BUILD_ID=${build.id}`,
      `PERCY_BUILD_URL=${buildUrl}`,
      `PERCY_APPROVE_LINK=${approveLink}`,
      `PERCY_RECOMMENDATION=${recommendation}`,
    ].join('\n'),
    'utf8',
  );
  console.log(markdown);
}

main().catch((error) => {
  const errorReport = `# Percy Automated Review Report\n\nFailed to generate report.\n\n\`\`\`\n${error.stack || error.message}\n\`\`\`\n`;
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, errorReport, 'utf8');
  fs.writeFileSync(
    REPORT_ENV_FILE,
    ['PERCY_BUILD_ID=', 'PERCY_BUILD_URL=', 'PERCY_APPROVE_LINK=', 'PERCY_RECOMMENDATION=REVIEW REQUIRED'].join(
      '\n',
    ),
    'utf8',
  );
  console.error(errorReport);
  process.exitCode = 0;
});
