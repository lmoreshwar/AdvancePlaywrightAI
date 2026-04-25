import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Architecture: @playwright/cli (Playwright MCP Server) Integration
 *
 * This reporter does NOT call external services during test execution.
 * Instead, it generates actionable `playwright-cli` commands in the debug report.
 *
 * Post-run workflow:
 *   1. Reporter generates AIC_DEBUG_REPORT.md with categorized failures + CLI commands
 *   2. AI agent (Copilot/Cursor) reads the report
 *   3. Agent executes `playwright-cli` commands to investigate failures against the live DOM
 *   4. Agent applies fixes based on evidence from DOM snapshots
 *
 * The `@playwright/cli` IS the Playwright MCP server — it is used by the AI agent
 * as an interactive tool for browser-driven diagnosis, NOT as an HTTP API.
 * See AGENTS.md → Execution Standard for the full workflow.
 */

/**
 * Failure categories for auto-classification
 */
type FailureCategory = 'Locator Change' | 'Script Issue' | 'UI Bug' | 'Environment Issue' | 'Unknown';

/**
 * Defect verdict — determines if a failure is a real application defect
 * that should be filed as a bug vs a test/infra issue.
 */
type DefectVerdict = 'DEFECT' | 'NOT A DEFECT' | 'INVESTIGATE';

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
    cliCommands: string[];
    verdict: DefectVerdict;
    verdictReason: string;
    screenshotPath?: string;
    tracePath?: string;
}

/**
 * Custom AI (Test-Time Analytics) Reporter
 *
 * Features:
 * - Real-time console output with pass/fail icons
 * - Auto-categorizes failures (Locator Change, Script Issue, UI Bug, Environment Issue)
 * - Generates AIC_DEBUG_REPORT.md with categorized RCA for every failure
 * - Generates HTML test report with dark theme
 * - Generates JSON report for CI/CD integration
 * - Writes GitHub Actions step summary (if running in CI)
 */
class AiDebugReporter implements Reporter {
    private reportDir: string = 'ai-debug-report';
    private results: TestReportEntry[] = [];
    private failures: FailureEntry[] = [];
    private startTime: number = 0;
    private totalTests: number = 0;
    private passedTests: number = 0;
    private failedTests: number = 0;
    private skippedTests: number = 0;
    private flakyTests: number = 0;
    private finalized: boolean = false;
    private runCompleted: boolean = false;
    private processGuardsRegistered: boolean = false;
    private runProjects: string[] = [];

    /**
     * Track per-test final outcomes to avoid counting retries as separate failures.
     * Key: test.id, Value: final status of the test across all attempts.
     */
    private testOutcomes: Map<string, { status: string; retryCount: number; hadFailure: boolean }> = new Map();

    onBegin(config: FullConfig, suite: Suite): void {
        this.startTime = Date.now();
        
        // Count only the tests that will actually be executed (matching the grep filter)
        this.totalTests = suite.allTests().filter((t: TestCase) => t.expectedStatus !== 'skipped').length;

        const projectSet = new Set<string>();
        for (const test of suite.allTests()) {
            if (test.expectedStatus === 'skipped') continue;
            const projectName = test.parent?.project()?.name || 'default';
            projectSet.add(projectName);
        }
        this.runProjects = Array.from(projectSet).sort();

        // Create report directory
        if (!fs.existsSync(this.reportDir)) {
            fs.mkdirSync(this.reportDir, { recursive: true });
        }

        this.registerProcessGuards();

        console.log(`\n🚀 OpenText AI Debug Reporter — Running ${this.totalTests} tests (Filtered from ${suite.allTests().length})\n`);
    }

    onTestBegin(test: TestCase): void {
        console.log(`  ▶ ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const status = result.status;
        const isRetry = result.retry > 0;
        const retryLabel = isRetry ? ` [Retry #${result.retry}]` : '';
        const icon = status === 'passed' ? '✅' : (status === 'failed' || status === 'timedOut') ? '❌' : '⏭️';
        console.log(`  ${icon} ${test.title} (${result.duration}ms) [${status.toUpperCase()}]${retryLabel}`);

        // Track per-test outcomes — only the FINAL attempt matters for counts
        const existing = this.testOutcomes.get(test.id);
        const hadPriorFailure = existing?.hadFailure || false;
        this.testOutcomes.set(test.id, {
            status,
            retryCount: result.retry,
            hadFailure: hadPriorFailure || status === 'failed' || status === 'timedOut',
        });

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
            errors: result.errors.map((e: { message?: string }) => e.message || '').filter(Boolean),
            steps: result.steps.map((s: { title: string; duration: number; error?: { message?: string } }) => ({
                title: s.title,
                duration: s.duration,
                error: s.error?.message,
            })),
            screenshotPath,
            tracePath,
        });

        // If the test failed or timed out, categorize and track the failure
        // Only track the FINAL attempt's failure (avoid duplicates from retries)
        if ((result.status === 'failed' || result.status === 'timedOut') && result.errors.length > 0) {
            const errorMsg = result.errors[0].message || '';
            const errorLocation = this.extractErrorLocation(result.errors[0]);

            const category = this.categorizeFailure(errorMsg);
            const { selfHealable, suggestion } = this.getSelfHealingInfo(category, errorMsg);
            const cliCommands = this.generateCliCommands(category, test.title, test.parent?.project()?.name || 'default', tracePath);
            const { verdict, reason: verdictReason } = this.determineDefectVerdict(category, errorMsg, errorLocation);

            const failureEntry: FailureEntry = {
                testTitle: test.title,
                fullTitle: test.titlePath().join(' > '),
                project: test.parent?.project()?.name || 'default',
                errorMessage: this.cleanAnsiCodes(errorMsg),
                errorLocation,
                category,
                selfHealable,
                suggestion,
                cliCommands,
                verdict,
                verdictReason,
                screenshotPath,
                tracePath,
            };

            // Replace existing failure for same test (from prior retry), or add new
            const existingIdx = this.failures.findIndex((f) => f.fullTitle === failureEntry.fullTitle && f.project === failureEntry.project);
            if (existingIdx >= 0) {
                this.failures[existingIdx] = failureEntry; // Update with latest retry's error
            } else {
                this.failures.push(failureEntry);
            }
        }

        // If a test PASSED on retry, remove it from failures (it self-healed via retry)
        if (result.status === 'passed' && result.retry > 0) {
            const fullTitle = test.titlePath().join(' > ');
            const project = test.parent?.project()?.name || 'default';
            this.failures = this.failures.filter((f) => !(f.fullTitle === fullTitle && f.project === project));
        }

        // Keep a rolling checkpoint so interrupted runs still have a usable report.
        this.writeCheckpointReport();
    }

    onEnd(result: FullResult): void {
        this.runCompleted = true;
        const totalTime = Date.now() - this.startTime;

        // ═══════════════════════════════════════
        // COMPUTE FINAL COUNTS FROM UNIQUE TEST OUTCOMES
        // Each test is counted exactly ONCE based on its final status.
        // Retries are collapsed: if a test failed then passed on retry → Flaky.
        // ═══════════════════════════════════════
        this.passedTests = 0;
        this.failedTests = 0;
        this.skippedTests = 0;
        this.flakyTests = 0;

        for (const [, outcome] of this.testOutcomes) {
            if (outcome.status === 'passed') {
                if (outcome.hadFailure && outcome.retryCount > 0) {
                    this.flakyTests++; // Passed on retry = flaky
                }
                this.passedTests++;
            } else if (outcome.status === 'failed' || outcome.status === 'timedOut' || outcome.status === 'interrupted') {
                this.failedTests++;
            } else {
                this.skippedTests++;
            }
        }

        // Suppress summary if no tests were actually executed (e.g., in a dry run/--list)
        if (this.passedTests === 0 && this.failedTests === 0 && this.skippedTests === 0 && this.totalTests > 0) {
            console.log(`\n📋 Dry Run Complete: ${this.totalTests} tests verified.\n`);
            return;
        }

        console.log(`\n${'═'.repeat(60)}`);
        console.log(`📊 OpenText AI Debug Report Summary`);
        console.log(`${'═'.repeat(60)}`);
        console.log(`  Total:   ${this.totalTests}`);
        console.log(`  Passed:  ${this.passedTests} ✅`);
        console.log(`  Failed:  ${this.failedTests} ❌`);
        console.log(`  Flaky:   ${this.flakyTests} ⚠️`);
        console.log(`  Skipped: ${this.skippedTests} ⏭️`);
        console.log(`  Time:    ${(totalTime / 1000).toFixed(2)}s`);
        console.log(`  Status:  ${result.status.toUpperCase()}`);
        console.log(`${'═'.repeat(60)}\n`);

        this.finalizeReports(totalTime, result.status, false, 'Completed run');

        console.log(`🔍 AI Debug Report generated successfully at ${this.reportDir}`);

        // Write GitHub Actions step summary if in CI
        this.writeGitHubSummary(totalTime);
    }

    private registerProcessGuards(): void {
        if (this.processGuardsRegistered) return;
        this.processGuardsRegistered = true;

        const flushPartial = (reason: string) => {
            if (this.runCompleted || this.finalized) return;
            const totalTime = Date.now() - this.startTime;
            this.finalizeReports(totalTime, 'interrupted', true, reason);
        };

        process.once('SIGINT', () => flushPartial('Interrupted by SIGINT'));
        process.once('SIGTERM', () => flushPartial('Interrupted by SIGTERM'));
        process.once('uncaughtException', () => flushPartial('Uncaught exception'));
        process.once('unhandledRejection', () => flushPartial('Unhandled promise rejection'));
    }

    private writeCheckpointReport(): void {
        if (this.finalized) return;
        const totalTime = Date.now() - this.startTime;
        this.generateJsonReport(totalTime);
        this.generateDebugReport(totalTime, true, 'Checkpoint report (run in progress)');
    }

    private finalizeReports(totalTime: number, status: string, isPartial: boolean, reason: string): void {
        if (this.finalized) return;
        this.finalized = true;

        this.generateHtmlReport(totalTime);
        this.generateJsonReport(totalTime);
        this.generateDebugReport(totalTime, isPartial, reason);

        if (isPartial) {
            console.warn(`⚠️ Partial AI Debug Report generated due to interruption: ${reason} (${status})`);
        }
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
            (msg.includes('tobevisible') || msg.includes('timeout') || msg.includes('visible'))
        ) {
            return 'Locator Change';
        }

        // Environment Issues — timeouts, navigation failures, BrowserStack session limits
        if (
            msg.includes('navigation timeout') ||
            msg.includes('net::err_') ||
            msg.includes('browserstack') ||
            msg.includes('automate testing time expired') ||
            msg.includes('time expired') ||
            msg.includes('browsertype.connect') ||
            (msg.includes('page.goto') && msg.includes('timeout')) ||
            msg.includes('browsercontext.close') ||
            msg.includes('target closed') ||
            msg.includes('econnrefused') ||
            msg.includes('timeout') // Catch-all for generic timeouts
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
        _errorMsg: string,
    ): { selfHealable: boolean; suggestion: string } {
        switch (category) {
            case 'Locator Change':
                return {
                    selfHealable: true,
                    suggestion:
                        'Run `playwright-cli open <url>` → `snapshot` to find the correct locator in the current DOM. Update the PageObject file.',
                };
            case 'Script Issue':
                return {
                    selfHealable: true,
                    suggestion:
                        'Fix the script logic (e.g., add .first() for strict mode, increase timeout, fix assertion). Use trace viewer for context.',
                };
            case 'Environment Issue':
                return {
                    selfHealable: false,
                    suggestion: 'Infrastructure/network issue — not a code defect. Retry the test or check BrowserStack/CI health.',
                };
            case 'UI Bug':
                return {
                    selfHealable: false,
                    suggestion: 'Application behavior changed. Use `playwright-cli snapshot` to capture current state and file a bug report.',
                };
            default:
                return {
                    selfHealable: false,
                    suggestion: 'Run the investigation commands below to diagnose. Use `playwright-cli snapshot` for DOM evidence.',
                };
        }
    }

    // ═══════════════════════════════════════
    // DEFECT VERDICT ENGINE
    // ═══════════════════════════════════════

    /**
     * Determines whether a failure is an actual application DEFECT or a test/infra issue.
     *
     * Verdict logic:
     *   DEFECT          → Application behavior changed (assertion mismatch, UI content wrong)
     *   NOT A DEFECT    → Test code issue or infrastructure (locator stale, timeout, env failure)
     *   INVESTIGATE     → Cannot determine automatically — needs manual/CLI investigation
     */
    private determineDefectVerdict(
        category: FailureCategory,
        errorMsg: string,
        _errorLocation: string,
    ): { verdict: DefectVerdict; reason: string } {
        const msg = errorMsg.toLowerCase();

        // ── DEFINITE NOT-A-DEFECT scenarios ──
        if (category === 'Environment Issue') {
            return {
                verdict: 'NOT A DEFECT',
                reason: 'Infrastructure/environment failure (timeout, network, BrowserStack session limit). No application code change needed.',
            };
        }

        if (category === 'Locator Change') {
            // Check if the locator was clearly invalid (typo, placeholder like "wronglocotor")
            if (msg.includes('wronglocotor') || msg.includes('placeholder') || msg.includes('todo')) {
                return {
                    verdict: 'NOT A DEFECT',
                    reason: 'Locator is a placeholder/typo in the test code. Fix the PageObject, not the application.',
                };
            }
            return {
                verdict: 'INVESTIGATE',
                reason: 'Element not found in DOM. Could be a UI redesign (DEFECT) or a stale locator. Run `playwright-cli snapshot` to check if the element still exists with a different selector.',
            };
        }

        if (category === 'Script Issue') {
            return {
                verdict: 'NOT A DEFECT',
                reason: 'Test script logic error (strict mode violation, missing .first(), bad assertion). Fix the test code.',
            };
        }

        // ── DEFINITE DEFECT scenarios (UI Bug category) ──
        if (category === 'UI Bug') {
            // Assertion value mismatch = actual application output differs from expected
            if (msg.includes('expected:') && msg.includes('received:')) {
                return {
                    verdict: 'DEFECT',
                    reason: 'Assertion mismatch — application returned unexpected content. Expected vs Received values differ. File a bug with the actual vs expected comparison.',
                };
            }
            // Element visibility mismatch — something that should be hidden is visible or vice versa
            if (msg.includes('tobehidden') || msg.includes('tobevisible')) {
                return {
                    verdict: 'DEFECT',
                    reason: 'UI element visibility state is wrong (visible when should be hidden, or vice versa). This indicates a UI behavior regression.',
                };
            }
            // Text content assertion failed
            if (msg.includes('tohavetext') || msg.includes('tohavecount')) {
                return {
                    verdict: 'DEFECT',
                    reason: 'Text or element count assertion failed. The application content has changed from the expected baseline.',
                };
            }
            return {
                verdict: 'DEFECT',
                reason: 'Application behavior does not match the expected test assertion. Likely a UI regression.',
            };
        }

        // ── UNKNOWN category → needs investigation ──
        return {
            verdict: 'INVESTIGATE',
            reason: 'Cannot auto-determine. Run the `playwright-cli` investigation commands below to gather DOM evidence and determine root cause.',
        };
    }

    // ═══════════════════════════════════════
    // PLAYWRIGHT-CLI COMMAND GENERATOR
    // ═══════════════════════════════════════

    /**
     * Generate actionable `playwright-cli` commands for the AI agent to investigate a failure.
     * These commands are what the agent will execute via MCP (@playwright/cli) post-run.
     */
    private generateCliCommands(
        category: FailureCategory,
        _testTitle: string,
        _project: string,
        tracePath?: string,
    ): string[] {
        const baseUrl = process.env.BASE_URL || 'https://www.opentext.com';
        const commands: string[] = [];

        // Always start with opening the page and taking a snapshot
        commands.push(`playwright-cli open ${baseUrl}`);
        commands.push('playwright-cli snapshot');

        switch (category) {
            case 'Locator Change':
                // For locator issues: snapshot the DOM, inspect elements, find the new locator
                commands.push('# Inspect the area where the element was expected:');
                commands.push('playwright-cli snapshot --depth=4');
                commands.push('# Evaluate specific selectors to find the element:');
                commands.push(`playwright-cli eval "document.querySelectorAll('[role=link],[role=button],[role=navigation]').length"`);
                commands.push('# Once you find the element ref (e.g., e15), get its attributes:');
                commands.push('playwright-cli eval "el => el.getAttribute(\'aria-label\')" e15');
                commands.push('playwright-cli eval "el => el.textContent" e15');
                break;

            case 'Script Issue':
                // For script issues: replay via trace if available
                if (tracePath) {
                    commands.push(`# View the trace to understand the failure context:`);
                    commands.push(`npx playwright show-trace ${tracePath}`);
                }
                commands.push('# Check how many matching elements exist (strict mode fix):');
                commands.push(`playwright-cli eval "document.querySelectorAll('button, [role=button]').length"`);
                break;

            case 'UI Bug':
                // For UI bugs: capture the current state as evidence for bug report
                commands.push('# Capture current state as evidence for the bug report:');
                commands.push('playwright-cli screenshot --filename=defect-evidence.png');
                commands.push('# Check the actual text/content on the page:');
                commands.push(`playwright-cli eval "document.title"`);
                commands.push('playwright-cli snapshot --filename=defect-dom-state.yaml');
                if (tracePath) {
                    commands.push(`npx playwright show-trace ${tracePath}`);
                }
                break;

            case 'Environment Issue':
                // For env issues: minimal commands, mainly verify connectivity
                commands.push('# Verify the site is accessible:');
                commands.push(`playwright-cli eval "document.readyState"`);
                commands.push('playwright-cli network');
                break;

            default:
                // Unknown: full investigation
                commands.push('# Full investigation — take deep snapshot and console logs:');
                commands.push('playwright-cli snapshot --depth=6');
                commands.push('playwright-cli console');
                commands.push('playwright-cli network');
                if (tracePath) {
                    commands.push(`npx playwright show-trace ${tracePath}`);
                }
                break;
        }

        commands.push('playwright-cli close');
        return commands;
    }

    // ═══════════════════════════════════════
    // AIC DEBUG REPORT GENERATION
    // ═══════════════════════════════════════

    /**
     * Generate the AIC_DEBUG_REPORT.md with categorized failures
     */
    private generateDebugReport(totalTime: number, isPartial: boolean = false, runNote: string = ''): void {
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
        md += `**Duration**: ${(totalTime / 1000).toFixed(1)}s  \n`;
        md += `**Run Mode**: ${isPartial ? 'Partial (Interrupted/In Progress)' : 'Complete'}  \n`;
        if (runNote) {
            md += `**Run Note**: ${runNote}  \n`;
        }
        md += `**Percy Visuals**: [👁️ View on Percy Dashboard](https://percy.io/opentext/opentext-tta/)\n\n`;

        const workflowInputs = this.getWorkflowInputs();
        const baseUrl = process.env.BASE_URL || '';
        const bstackPlatforms = this.getBrowserstackPlatforms();
        if (Object.keys(workflowInputs).length > 0 || this.runProjects.length > 0 || baseUrl) {
            md += `## ⚙️ Run Configuration\n\n`;
            if (Object.keys(workflowInputs).length > 0) {
                md += `| Input | Value |\n`;
                md += `|---|---|\n`;
                for (const [key, value] of Object.entries(workflowInputs)) {
                    md += `| ${key} | ${value} |\n`;
                }
                md += `\n`;
            }

            if (this.runProjects.length > 0) {
                md += `**Projects**: ${this.runProjects.join(', ')}  \n`;
            }
            if (bstackPlatforms.length > 0) {
                md += `**BrowserStack Platforms**: ${bstackPlatforms.join('; ')}  \n`;
            }
            if (baseUrl) {
                md += `**Base URL**: ${baseUrl}  \n`;
            }
            md += `\n`;
        }

        if (this.failures.length === 0) {
            md += `> [!TIP]\n> **All tests passed!** Your baseline is healthy. Review the snapshots on Percy.\n\n`;
        }

        md += `## 📊 Run Summary\n\n`;
        md += `| Metric | Value |\n`;
        md += `|---|---|\n`;
        md += `| Total Tests | ${this.totalTests} |\n`;
        md += `| ✅ Passed | ${this.passedTests} |\n`;
        md += `| ❌ Failed | ${this.failedTests} |\n`;
        md += `| ⚠️ Flaky (passed on retry) | ${this.flakyTests} |\n`;
        md += `| ⏭️ Skipped | ${this.skippedTests} |\n\n`;

        md += `## 🗂️ Failure Breakdown by Category\n\n`;
        md += `| Category | Count | AI Healable |\n`;
        md += `|---|---|---|\n`;
        for (const [cat, count] of Object.entries(categoryCounts)) {
            const healable = cat === 'Locator Change' || cat === 'Script Issue' ? '✅ Yes' : '❌ No';
            md += `| ${categoryEmoji[cat as FailureCategory] || '❓'} ${cat} | ${count} | ${healable} |\n`;
        }
        md += `\n`;

        // Defect summary
        const defects = this.failures.filter((f) => f.verdict === 'DEFECT');
        const notDefects = this.failures.filter((f) => f.verdict === 'NOT A DEFECT');
        const investigate = this.failures.filter((f) => f.verdict === 'INVESTIGATE');

        if (this.failures.length > 0) {
            md += `## 🎯 Defect Verdict Summary\n\n`;
            md += `| Verdict | Count | Action |\n`;
            md += `|---|---|---|\n`;
            if (defects.length > 0) md += `| 🚨 **DEFECT** | ${defects.length} | File bug report to dev team |\n`;
            if (notDefects.length > 0) md += `| ✅ NOT A DEFECT | ${notDefects.length} | Fix test code / retry / ignore |\n`;
            if (investigate.length > 0) md += `| 🔍 INVESTIGATE | ${investigate.length} | Run CLI commands below to determine |\n`;
            md += `\n`;

            if (defects.length > 0) {
                md += `> [!CAUTION]\n> **${defects.length} failure(s) identified as APPLICATION DEFECTS.**\n> These are real bugs in the application, not test issues. See details below.\n\n`;
            }
        }

        md += `---\n\n`;

        // Individual failure entries
        for (let i = 0; i < this.failures.length; i++) {
            const f = this.failures[i];
            const verdictEmoji = f.verdict === 'DEFECT' ? '🚨' : f.verdict === 'NOT A DEFECT' ? '✅' : '🔍';

            md += `## 🔴 FAILURE #${i + 1}\n\n`;
            md += `### 1. 🚨 Failure Summary\n`;
            md += `- **Test**: \`${f.testTitle}\`\n`;
            md += `- **Project**: \`${f.project}\`\n`;
            md += `- **Error Location**: \`${f.errorLocation}\`\n`;
            md += `- **Error**:\n\`\`\`\n${f.errorMessage.substring(0, 500)}\n\`\`\`\n\n`;

            md += `### 2. 🗂️ Category: **${categoryEmoji[f.category]} ${f.category}**\n\n`;

            md += `### 3. 🎯 Defect Verdict: **${verdictEmoji} ${f.verdict}**\n`;
            md += `> ${f.verdictReason}\n\n`;

            md += `### 4. 🤖 Self-Healing\n`;
            md += `- **AI Healable**: ${f.selfHealable ? '✅ Yes' : '❌ No'}\n`;
            md += `- **Suggestion**: ${f.suggestion}\n\n`;

            if (f.cliCommands.length > 0) {
                md += `### 5. 🔧 Investigation Commands (playwright-cli / MCP)\n`;
                md += `\`\`\`bash\n`;
                for (const cmd of f.cliCommands) {
                    md += `${cmd}\n`;
                }
                md += `\`\`\`\n\n`;
            }

            if (f.screenshotPath) {
                md += `### 6. 📸 Screenshot\n`;
                md += `\`${f.screenshotPath}\`\n\n`;
            }
            if (f.tracePath) {
                md += `### 7. 🔬 Trace\n`;
                md += `\`npx playwright show-trace ${f.tracePath}\`\n\n`;
            }

            md += `---\n\n`;
        }

        // Category guide
        md += `## 📋 Failure Category Guide\n\n`;
        md += `| Category | What It Means | AI Action |\n`;
        md += `|---|---|---|\n`;
        md += `| 🔗 Locator Change | DOM structure or element text changed | AI agent runs \`playwright-cli snapshot\` to find new locator |\n`;
        md += `| 📝 Script Issue | Test code logic error (strict mode, timeout) | Auto-fix the script |\n`;
        md += `| 🐛 UI Bug | Application behavior changed unexpectedly | 🚨 **DEFECT** — File bug to development team |\n`;
        md += `| 🌐 Environment Issue | Network, server, or infrastructure problem | Retry or check infra health |\n\n`;

        md += `## 🎯 Defect Verdict Guide\n\n`;
        md += `| Verdict | Meaning | What To Do |\n`;
        md += `|---|---|---|\n`;
        md += `| 🚨 DEFECT | Application has a real bug | File a bug report with the error details and evidence screenshots |\n`;
        md += `| ✅ NOT A DEFECT | Test code, locator, or infra issue | Fix the test, update locator, or retry |\n`;
        md += `| 🔍 INVESTIGATE | Cannot auto-determine | Run the \`playwright-cli\` commands to gather DOM evidence |\n`;

        // Write to ai-debug-report directory
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

    private getWorkflowInputs(): Record<string, string> {
        const eventPath = process.env.GITHUB_EVENT_PATH;
        if (!eventPath || !fs.existsSync(eventPath)) return {};

        try {
            const raw = fs.readFileSync(eventPath, 'utf-8');
            const payload = JSON.parse(raw) as { inputs?: Record<string, unknown> };
            const inputs = payload.inputs || {};
            const normalized: Record<string, string> = {};
            for (const [key, value] of Object.entries(inputs)) {
                normalized[key] = String(value ?? '');
            }
            return normalized;
        } catch {
            return {};
        }
    }

    private getBrowserstackPlatforms(): string[] {
        const candidates = [
            process.env.BROWSERSTACK_CONFIG_FILE,
            path.join('configs', 'browserstack.dynamic.yml'),
            path.join('configs', 'browserstack.yml'),
        ].filter(Boolean) as string[];

        let configPath: string | undefined;
        for (const candidate of candidates) {
            if (candidate && fs.existsSync(candidate)) {
                configPath = candidate;
                break;
            }
        }

        if (!configPath) return [];

        try {
            const raw = fs.readFileSync(configPath, 'utf-8');
            const lines = raw.split(/\r?\n/);
            const platforms: string[] = [];
            let current: Record<string, string> = {};

            const flush = () => {
                if (!current.os && !current.browserName) return;
                const osPart = [current.os, current.osVersion].filter(Boolean).join(' ');
                const browserPart = [current.browserName, current.browserVersion].filter(Boolean).join(' ');
                const resolutionPart = current.resolution ? `@ ${current.resolution}` : '';
                const combined = [osPart, browserPart, resolutionPart].filter(Boolean).join(' | ');
                platforms.push(combined.trim());
                current = {};
            };

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('- os:')) {
                    flush();
                    current.os = trimmed.replace('- os:', '').trim();
                    continue;
                }
                if (trimmed.startsWith('osVersion:')) {
                    current.osVersion = trimmed.replace('osVersion:', '').trim();
                    continue;
                }
                if (trimmed.startsWith('browserName:')) {
                    current.browserName = trimmed.replace('browserName:', '').trim();
                    continue;
                }
                if (trimmed.startsWith('browserVersion:')) {
                    current.browserVersion = trimmed.replace('browserVersion:', '').trim();
                    continue;
                }
                if (trimmed.startsWith('resolution:')) {
                    current.resolution = trimmed.replace('resolution:', '').trim();
                }
            }

            flush();
            return platforms;
        } catch {
            return [];
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
        summary += `| ⚠️ Flaky | ${this.flakyTests} |\n`;
        summary += `| ⏭️ Skipped | ${this.skippedTests} |\n`;
        summary += `| ⏱️ Duration | ${(totalTime / 1000).toFixed(1)}s |\n\n`;

        if (this.failures.length > 0) {
            summary += `### ❌ Failed Tests\n\n`;
            summary += `| Test | Category | Verdict | AI Healable |\n|---|---|---|---|\n`;
            for (const f of this.failures) {
                const healIcon = f.selfHealable ? '✅' : '❌';
                const verdictIcon = f.verdict === 'DEFECT' ? '🚨 DEFECT' : f.verdict === 'NOT A DEFECT' ? '✅ Not a defect' : '🔍 Investigate';
                summary += `| ${f.testTitle} | ${f.category} | ${verdictIcon} | ${healIcon} |\n`;
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
    <title>OpenText AI Test Report</title>
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
        .verdict { border-radius: 4px; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .verdict-defect { background: #7f1d1d; color: #fca5a5; }
        .verdict-ok { background: #052e16; color: #86efac; }
        .verdict-investigate { background: #422006; color: #fbbf24; }
        .error { background: #1c1012; border: 1px solid #ef4444; border-radius: 6px; padding: .75rem; margin-top: .5rem; font-size: 0.85rem; color: #fca5a5; white-space: pre-wrap; word-break: break-word; }
        .timestamp { text-align: center; color: #555; font-size: 0.8rem; margin-top: 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 OpenText AI Test Report</h1>
        <p style="color:#888">${new Date().toLocaleString()}</p>
        <div style="margin-top: 15px;">
            <a href="https://percy.io/opentext/opentext-tta/" target="_blank" 
               style="background: #5b5fc7; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px;">
               👁️ View Visuals on Percy
            </a>
        </div>
    </div>
    <div class="summary">
        <div class="summary-card total"><div class="value">${this.totalTests}</div><div class="label">Total</div></div>
        <div class="summary-card passed"><div class="value">${this.passedTests}</div><div class="label">Passed</div></div>
        <div class="summary-card failed"><div class="value">${this.failedTests}</div><div class="label">Failed</div></div>
        <div class="summary-card" style="border-left: 3px solid #f59e0b;"><div class="value" style="color:#f59e0b;">${this.flakyTests}</div><div class="label">Flaky</div></div>
        <div class="summary-card skipped"><div class="value">${this.skippedTests}</div><div class="label">Skipped</div></div>
        <div class="summary-card"><div class="value">${(totalTime / 1000).toFixed(1)}s</div><div class="label">Duration</div></div>
    </div>
    <div class="test-list">
        ${this.results
            .map((r) => {
                const failure = this.failures.find((f) => f.fullTitle === r.fullTitle);
                const catClass = failure ? this.getCategoryClass(failure.category) : '';
                const catLabel = failure ? `<span class="category ${catClass}">${failure.category}</span>` : '';
                const verdictClass = failure ? (failure.verdict === 'DEFECT' ? 'verdict-defect' : failure.verdict === 'NOT A DEFECT' ? 'verdict-ok' : 'verdict-investigate') : '';
                const verdictLabel = failure ? `<span class="verdict ${verdictClass}">${failure.verdict === 'DEFECT' ? '\u{1F6A8} DEFECT' : failure.verdict === 'NOT A DEFECT' ? '\u2705 Not a Defect' : '\u{1F50D} Investigate'}</span>` : '';
                return `
        <div class="test-item ${r.status}">
            <span>${r.status === 'passed' ? '\u2705' : r.status === 'failed' ? '\u274C' : '\u23ED\uFE0F'}</span>
            <div class="title">
                ${r.fullTitle}
                ${r.errors.length > 0 ? `<div class="error">${this.cleanAnsiCodes(r.errors[0]).substring(0, 300)}</div>` : ''}
            </div>
            ${verdictLabel}
            ${catLabel}
            <span class="project">${r.project}</span>
            <span class="duration">${r.duration}ms</span>
        </div>`;
            })
            .join('')}
    </div>
    <div class="timestamp">Generated by OpenText AI Debug Reporter — AI Self-Healing Framework</div>
</body>
</html>`;

        const reportPath = path.join(this.reportDir, 'index.html');
        fs.writeFileSync(reportPath, html, 'utf-8');
        console.log(`📄 AI HTML Report: ${path.resolve(reportPath)}`);
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
                        flaky: this.flakyTests,
                        skipped: this.skippedTests,
                        duration: totalTime,
                        timestamp: new Date().toISOString(),
                    },
                    failures: this.failures.map((f) => ({
                        test: f.testTitle,
                        category: f.category,
                        verdict: f.verdict,
                        verdictReason: f.verdictReason,
                        selfHealable: f.selfHealable,
                        suggestion: f.suggestion,
                        cliCommands: f.cliCommands,
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
        console.log(`📄 AI JSON Report: ${path.resolve(reportPath)}`);
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

export default AiDebugReporter;
