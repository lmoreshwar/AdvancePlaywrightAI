import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Failure categories for auto-classification
 */
type FailureCategory = 'Locator Change' | 'Script Issue' | 'UI Bug' | 'Environment Issue' | 'Unknown';

/**
 * Categorized failure entry
 */
interface FailureEntry {
    testTitle: string;
    fullTitle: string;
    project: string;
    errorMessage: string;
    errorLocation: string;
    category: FailureCategory;
    selfHealable: boolean;
    suggestion: string;
    screenshotPath?: string;
    tracePath?: string;
}

/**
 * Custom TTA (Test-Time Analytics) Reporter
 *
 * Features:
 * - Real-time console output with pass/fail icons
 * - Auto-categorizes failures (Locator Change, Script Issue, UI Bug, Environment Issue)
 * - Generates AIC_DEBUG_REPORT.md with categorized RCA for every failure
 * - Generates HTML test report with dark theme
 * - Generates JSON report for CI/CD integration
 * - Writes GitHub Actions step summary (if running in CI)
 */
class CustomTTAReporter implements Reporter {
    private reportDir: string = 'tta-report';
    private results: TestReportEntry[] = [];
    private failures: FailureEntry[] = [];
    private startTime: number = 0;
    private totalTests: number = 0;
    private passedTests: number = 0;
    private failedTests: number = 0;
    private skippedTests: number = 0;

    onBegin(config: FullConfig, suite: Suite): void {
        this.startTime = Date.now();
        this.totalTests = suite.allTests().length;

        // Create report directory
        if (!fs.existsSync(this.reportDir)) {
            fs.mkdirSync(this.reportDir, { recursive: true });
        }

        console.log(`\n🚀 OpenText TTA Reporter — Running ${this.totalTests} tests\n`);
    }

    onTestBegin(test: TestCase): void {
        console.log(`  ▶ ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const icon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
        console.log(`  ${icon} ${test.title} (${result.duration}ms)`);

        if (result.status === 'passed') this.passedTests++;
        else if (result.status === 'failed') this.failedTests++;
        else this.skippedTests++;

        // Extract screenshot and trace paths from attachments
        let screenshotPath: string | undefined;
        let tracePath: string | undefined;
        for (const attachment of result.attachments) {
            if (attachment.name === 'screenshot' && attachment.path) {
                screenshotPath = attachment.path;
            }
            if (attachment.name === 'trace' && attachment.path) {
                tracePath = attachment.path;
            }
        }

        this.results.push({
            title: test.title,
            fullTitle: test.titlePath().join(' > '),
            status: result.status || 'unknown',
            duration: result.duration,
            project: test.parent?.project()?.name || 'default',
            errors: result.errors.map((e) => e.message || '').filter(Boolean),
            steps: result.steps.map((s) => ({
                title: s.title,
                duration: s.duration,
                error: s.error?.message,
            })),
            screenshotPath,
            tracePath,
        });

        // If the test failed, categorize and track the failure
        if (result.status === 'failed' && result.errors.length > 0) {
            const errorMsg = result.errors[0].message || '';
            const errorLocation = this.extractErrorLocation(result.errors[0]);

            const category = this.categorizeFailure(errorMsg);
            const { selfHealable, suggestion } = this.getSelfHealingInfo(category, errorMsg);

            this.failures.push({
                testTitle: test.title,
                fullTitle: test.titlePath().join(' > '),
                project: test.parent?.project()?.name || 'default',
                errorMessage: this.cleanAnsiCodes(errorMsg),
                errorLocation,
                category,
                selfHealable,
                suggestion,
                screenshotPath,
                tracePath,
            });
        }
    }

    onEnd(result: FullResult): void {
        const totalTime = Date.now() - this.startTime;

        console.log(`\n${'═'.repeat(60)}`);
        console.log(`📊 OpenText TTA Report Summary`);
        console.log(`${'═'.repeat(60)}`);
        console.log(`  Total:   ${this.totalTests}`);
        console.log(`  Passed:  ${this.passedTests} ✅`);
        console.log(`  Failed:  ${this.failedTests} ❌`);
        console.log(`  Skipped: ${this.skippedTests} ⏭️`);
        console.log(`  Time:    ${(totalTime / 1000).toFixed(2)}s`);
        console.log(`  Status:  ${result.status.toUpperCase()}`);
        console.log(`${'═'.repeat(60)}\n`);

        this.generateHtmlReport(totalTime);
        this.generateJsonReport(totalTime);

        // Generate AIC Debug Report if there are failures
        if (this.failures.length > 0) {
            this.generateDebugReport(totalTime);
            console.log(`🔍 AIC Debug Report generated with ${this.failures.length} failure(s)`);
        }

        // Write GitHub Actions step summary if in CI
        this.writeGitHubSummary(totalTime);
    }

    // ═══════════════════════════════════════
    // FAILURE CATEGORIZATION ENGINE
    // ═══════════════════════════════════════

    /**
     * Auto-categorize a failure based on error message patterns
     */
    private categorizeFailure(errorMessage: string): FailureCategory {
        const msg = errorMessage.toLowerCase();

        // Script Issues — problems in the test code itself
        if (msg.includes('strict mode violation') || (msg.includes('resolved to') && msg.includes('elements'))) {
            return 'Script Issue';
        }

        // Locator Changes — element not found or selector invalid
        if (
            (msg.includes('element(s) not found') ||
                msg.includes('waiting for locator') ||
                msg.includes('waiting for getby')) &&
            (msg.includes('tobevisible') || msg.includes('timeout'))
        ) {
            return 'Locator Change';
        }

        // Environment Issues — timeouts, navigation failures
        if (
            msg.includes('navigation timeout') ||
            msg.includes('net::err_') ||
            (msg.includes('page.goto') && msg.includes('timeout')) ||
            msg.includes('browsercontext.close') ||
            msg.includes('target closed') ||
            msg.includes('econnrefused')
        ) {
            return 'Environment Issue';
        }

        // UI Bugs — assertion mismatches (expected vs received)
        if (
            (msg.includes('expected:') && msg.includes('received:')) ||
            (msg.includes('tobehidden') && msg.includes('visible')) ||
            msg.includes('tohavetext') ||
            msg.includes('tohavecount')
        ) {
            return 'UI Bug';
        }

        // Locator Change fallback — general "not found" patterns
        if (msg.includes('not found') || msg.includes('no element') || msg.includes('could not find')) {
            return 'Locator Change';
        }

        return 'Unknown';
    }

    /**
     * Get self-healing metadata for a given failure category
     */
    private getSelfHealingInfo(
        category: FailureCategory,
        errorMsg: string,
    ): { selfHealable: boolean; suggestion: string } {
        switch (category) {
            case 'Locator Change':
                return {
                    selfHealable: true,
                    suggestion:
                        'Use SmartLocator with fallback strategies or update the locator to match the current DOM.',
                };
            case 'Script Issue':
                return {
                    selfHealable: true,
                    suggestion:
                        'Fix the script logic (e.g., add .first() for strict mode, increase timeout, fix assertion).',
                };
            case 'Environment Issue':
                return {
                    selfHealable: false,
                    suggestion: 'Retry the test or check network/server health. Not a code issue.',
                };
            case 'UI Bug':
                return {
                    selfHealable: false,
                    suggestion: '⚠️ Possible application bug — the UI behavior has changed. File a bug report.',
                };
            default:
                return {
                    selfHealable: false,
                    suggestion: 'Manual investigation required. Check the error details and screenshot.',
                };
        }
    }

    // ═══════════════════════════════════════
    // AIC DEBUG REPORT GENERATION
    // ═══════════════════════════════════════

    /**
     * Generate the AIC_DEBUG_REPORT.md with categorized failures
     */
    private generateDebugReport(totalTime: number): void {
        const categoryEmoji: Record<FailureCategory, string> = {
            'Locator Change': '🔗',
            'Script Issue': '📝',
            'UI Bug': '🐛',
            'Environment Issue': '🌐',
            Unknown: '❓',
        };

        // Count by category
        const categoryCounts: Record<string, number> = {};
        for (const f of this.failures) {
            categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
        }

        let md = `# 🔍 AIC Debug Report — Auto-Generated\n\n`;
        md += `**Generated**: ${new Date().toLocaleString()}  \n`;
        md += `**Duration**: ${(totalTime / 1000).toFixed(1)}s  \n\n`;

        md += `## 📊 Run Summary\n\n`;
        md += `| Metric | Value |\n`;
        md += `|---|---|\n`;
        md += `| Total Tests | ${this.totalTests} |\n`;
        md += `| ✅ Passed | ${this.passedTests} |\n`;
        md += `| ❌ Failed | ${this.failedTests} |\n`;
        md += `| ⏭️ Skipped | ${this.skippedTests} |\n\n`;

        md += `## 🗂️ Failure Breakdown by Category\n\n`;
        md += `| Category | Count | AI Healable |\n`;
        md += `|---|---|---|\n`;
        for (const [cat, count] of Object.entries(categoryCounts)) {
            const healable = cat === 'Locator Change' || cat === 'Script Issue' ? '✅ Yes' : '❌ No';
            md += `| ${categoryEmoji[cat as FailureCategory] || '❓'} ${cat} | ${count} | ${healable} |\n`;
        }
        md += `\n---\n\n`;

        // Individual failure entries
        for (let i = 0; i < this.failures.length; i++) {
            const f = this.failures[i];
            md += `## 🔴 FAILURE #${i + 1}\n\n`;
            md += `### 1. 🚨 Failure Summary\n`;
            md += `- **Test**: \`${f.testTitle}\`\n`;
            md += `- **Project**: \`${f.project}\`\n`;
            md += `- **Error Location**: \`${f.errorLocation}\`\n`;
            md += `- **Error**:\n\`\`\`\n${f.errorMessage.substring(0, 500)}\n\`\`\`\n\n`;

            md += `### 2. 🗂️ Category: **${categoryEmoji[f.category]} ${f.category}**\n\n`;

            md += `### 3. 🤖 Self-Healing\n`;
            md += `- **AI Healable**: ${f.selfHealable ? '✅ Yes' : '❌ No'}\n`;
            md += `- **Suggestion**: ${f.suggestion}\n\n`;

            if (f.screenshotPath) {
                md += `### 4. 📸 Screenshot\n`;
                md += `\`${f.screenshotPath}\`\n\n`;
            }
            if (f.tracePath) {
                md += `### 5. 🔬 Trace\n`;
                md += `\`npx playwright show-trace ${f.tracePath}\`\n\n`;
            }

            md += `---\n\n`;
        }

        // Category guide
        md += `## 📋 Failure Category Guide\n\n`;
        md += `| Category | What It Means | AI Action |\n`;
        md += `|---|---|---|\n`;
        md += `| 🔗 Locator Change | DOM structure or element text changed | Self-heal with SmartLocator fallback |\n`;
        md += `| 📝 Script Issue | Test code logic error (strict mode, timeout) | Auto-fix the script |\n`;
        md += `| 🐛 UI Bug | Application behavior changed unexpectedly | ⚠️ Flag as bug to development team |\n`;
        md += `| 🌐 Environment Issue | Network, server, or infrastructure problem | Retry or check infra health |\n`;

        // Write to tta-report directory
        const reportPath = path.join(this.reportDir, 'AIC_DEBUG_REPORT.md');
        fs.writeFileSync(reportPath, md, 'utf-8');
        console.log(`📄 AIC Debug Report: ${path.resolve(reportPath)}`);

        // Also update the FRAMEWORK_HUB copy
        const frameworkHubPath = path.join('FRAMEWORK_HUB', '03_AI_Commands', 'AIC_DEBUG_REPORT.md');
        try {
            fs.writeFileSync(frameworkHubPath, md, 'utf-8');
        } catch {
            // Silently skip if directory doesn't exist in CI
        }
    }

    // ═══════════════════════════════════════
    // GITHUB ACTIONS STEP SUMMARY
    // ═══════════════════════════════════════

    /**
     * Write a GitHub Actions step summary if running in CI
     */
    private writeGitHubSummary(totalTime: number): void {
        const summaryPath = process.env.GITHUB_STEP_SUMMARY;
        if (!summaryPath) return; // Not in GitHub Actions

        let summary = `## 📊 OpenText Test Results\n\n`;
        summary += `| Metric | Value |\n|---|---|\n`;
        summary += `| Total | ${this.totalTests} |\n`;
        summary += `| ✅ Passed | ${this.passedTests} |\n`;
        summary += `| ❌ Failed | ${this.failedTests} |\n`;
        summary += `| ⏭️ Skipped | ${this.skippedTests} |\n`;
        summary += `| ⏱️ Duration | ${(totalTime / 1000).toFixed(1)}s |\n\n`;

        if (this.failures.length > 0) {
            summary += `### ❌ Failed Tests\n\n`;
            summary += `| Test | Category | AI Healable |\n|---|---|---|\n`;
            for (const f of this.failures) {
                const healIcon = f.selfHealable ? '✅' : '❌';
                summary += `| ${f.testTitle} | ${f.category} | ${healIcon} |\n`;
            }
            summary += `\n> 📄 Download the **AIC Debug Report** from the artifacts for detailed RCA.\n`;
        } else {
            summary += `### ✅ All tests passed!\n`;
        }

        try {
            fs.appendFileSync(summaryPath, summary, 'utf-8');
        } catch {
            // Silently skip if summary file is not writable
        }
    }

    // ═══════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════

    /**
     * Remove ANSI color codes from error messages for clean markdown
     */
    private cleanAnsiCodes(text: string): string {
        // eslint-disable-next-line no-control-regex
        return text.replace(/\u001b\[\d+(;\d+)*m/g, '').trim();
    }

    /**
     * Extract file:line from error stack
     */
    private extractErrorLocation(error: {
        message?: string;
        stack?: string;
        location?: { file: string; line: number; column: number };
    }): string {
        if (error.location) {
            return `${path.basename(error.location.file)}:${error.location.line}`;
        }
        // Try to parse from stack trace
        const stack = error.stack || error.message || '';
        const match = stack.match(/at\s+.*?\(?([\w\\/.-]+\.ts):(\d+):\d+\)?/);
        if (match) {
            return `${path.basename(match[1])}:${match[2]}`;
        }
        return 'Unknown location';
    }

    // ═══════════════════════════════════════
    // REPORT GENERATORS
    // ═══════════════════════════════════════

    private generateHtmlReport(totalTime: number): void {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenText TTA Test Report</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0a0e1a; color: #e4e4e7; padding: 2rem; }
        .header { text-align: center; margin-bottom: 2rem; }
        .header h1 { font-size: 1.8rem; color: #fff; margin-bottom: .5rem; }
        .summary { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
        .summary-card { background: #1a1f2e; border-radius: 12px; padding: 1.5rem 2rem; min-width: 150px; text-align: center; }
        .summary-card .value { font-size: 2rem; font-weight: 700; }
        .summary-card .label { font-size: 0.85rem; color: #888; margin-top: .25rem; }
        .passed .value { color: #22c55e; }
        .failed .value { color: #ef4444; }
        .skipped .value { color: #eab308; }
        .total .value { color: #3b82f6; }
        .test-list { max-width: 900px; margin: 0 auto; }
        .test-item { background: #1a1f2e; border-radius: 8px; padding: 1rem 1.5rem; margin-bottom: .5rem; display: flex; align-items: center; gap: 1rem; }
        .test-item.passed { border-left: 4px solid #22c55e; }
        .test-item.failed { border-left: 4px solid #ef4444; }
        .test-item.skipped { border-left: 4px solid #eab308; }
        .test-item .title { flex: 1; }
        .test-item .duration { color: #888; font-size: 0.85rem; }
        .test-item .project { background: #2d3348; border-radius: 4px; padding: 2px 8px; font-size: 0.75rem; }
        .test-item .category { border-radius: 4px; padding: 2px 8px; font-size: 0.75rem; font-weight: 600; }
        .cat-locator { background: #422006; color: #fb923c; }
        .cat-script { background: #1e1b4b; color: #a5b4fc; }
        .cat-uibug { background: #4c0519; color: #fda4af; }
        .cat-env { background: #052e16; color: #86efac; }
        .error { background: #1c1012; border: 1px solid #ef4444; border-radius: 6px; padding: .75rem; margin-top: .5rem; font-size: 0.85rem; color: #fca5a5; white-space: pre-wrap; word-break: break-word; }
        .timestamp { text-align: center; color: #555; font-size: 0.8rem; margin-top: 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 OpenText TTA Test Report</h1>
        <p style="color:#888">${new Date().toLocaleString()}</p>
    </div>
    <div class="summary">
        <div class="summary-card total"><div class="value">${this.totalTests}</div><div class="label">Total</div></div>
        <div class="summary-card passed"><div class="value">${this.passedTests}</div><div class="label">Passed</div></div>
        <div class="summary-card failed"><div class="value">${this.failedTests}</div><div class="label">Failed</div></div>
        <div class="summary-card skipped"><div class="value">${this.skippedTests}</div><div class="label">Skipped</div></div>
        <div class="summary-card"><div class="value">${(totalTime / 1000).toFixed(1)}s</div><div class="label">Duration</div></div>
    </div>
    <div class="test-list">
        ${this.results
            .map((r) => {
                const failure = this.failures.find((f) => f.fullTitle === r.fullTitle);
                const catClass = failure ? this.getCategoryClass(failure.category) : '';
                const catLabel = failure ? `<span class="category ${catClass}">${failure.category}</span>` : '';
                return `
        <div class="test-item ${r.status}">
            <span>${r.status === 'passed' ? '✅' : r.status === 'failed' ? '❌' : '⏭️'}</span>
            <div class="title">
                ${r.fullTitle}
                ${r.errors.length > 0 ? `<div class="error">${this.cleanAnsiCodes(r.errors[0]).substring(0, 300)}</div>` : ''}
            </div>
            ${catLabel}
            <span class="project">${r.project}</span>
            <span class="duration">${r.duration}ms</span>
        </div>`;
            })
            .join('')}
    </div>
    <div class="timestamp">Generated by OpenText TTA Reporter — AI Self-Healing Framework</div>
</body>
</html>`;

        const reportPath = path.join(this.reportDir, 'index.html');
        fs.writeFileSync(reportPath, html, 'utf-8');
        console.log(`📄 TTA HTML Report: ${path.resolve(reportPath)}`);
    }

    private getCategoryClass(category: FailureCategory): string {
        switch (category) {
            case 'Locator Change':
                return 'cat-locator';
            case 'Script Issue':
                return 'cat-script';
            case 'UI Bug':
                return 'cat-uibug';
            case 'Environment Issue':
                return 'cat-env';
            default:
                return '';
        }
    }

    private generateJsonReport(totalTime: number): void {
        const reportPath = path.join(this.reportDir, 'results.json');
        fs.writeFileSync(
            reportPath,
            JSON.stringify(
                {
                    summary: {
                        total: this.totalTests,
                        passed: this.passedTests,
                        failed: this.failedTests,
                        skipped: this.skippedTests,
                        duration: totalTime,
                        timestamp: new Date().toISOString(),
                    },
                    failures: this.failures.map((f) => ({
                        test: f.testTitle,
                        category: f.category,
                        selfHealable: f.selfHealable,
                        suggestion: f.suggestion,
                        error: f.errorMessage.substring(0, 500),
                        location: f.errorLocation,
                    })),
                    tests: this.results,
                },
                null,
                2,
            ),
            'utf-8',
        );
        console.log(`📄 TTA JSON Report: ${path.resolve(reportPath)}`);
    }
}

interface TestReportEntry {
    title: string;
    fullTitle: string;
    status: string;
    duration: number;
    project: string;
    errors: string[];
    steps: { title: string; duration: number; error?: string }[];
    screenshotPath?: string;
    tracePath?: string;
}

export default CustomTTAReporter;
