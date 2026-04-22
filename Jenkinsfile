/**
 * Jenkinsfile — OpenText AI-Powered Playwright Framework
 * 
 * Fully parameterized pipeline for parallel cross-browser execution.
 * Supports BrowserStack cloud and local execution with environment switching.
 * 
 * Prerequisites (Jenkins Configuration):
 * - Node.js 22+ via NodeJS plugin → Global Tool: 'NodeJS-22'
 * - Jenkins Credentials:
 *     BROWSERSTACK_USERNAME  (Secret text)
 *     BROWSERSTACK_ACCESS_KEY (Secret text)
 * - Jenkins Plugins:
 *     HTML Publisher, AnsiColor, NodeJS, Timestamps
 */
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22' // Configure in: Manage Jenkins → Tools → NodeJS
    }

    parameters {
        choice(name: 'BROWSER', choices: ['desktop-chrome', 'desktop-firefox', 'desktop-safari', 'desktop-edge', 'all'], description: 'Browser project to run tests on')
        choice(name: 'ENVIRONMENT', choices: ['production', 'staging', 'qa', 'dev'], description: 'Target environment')
        choice(name: 'TEST_SUITE', choices: ['all', 'smoke', 'regression', 'header', 'homepage', 'responsive'], description: 'Test suite to execute')
        choice(name: 'EXECUTION_PLATFORM', choices: ['browserstack', 'local'], description: 'Run on BrowserStack cloud or locally')
        string(name: 'CUSTOM_GREP', defaultValue: '', description: 'Optional: Custom grep filter (e.g. @P0, @P2)')
    }

    environment {
        CI                      = 'true'
        TEST_ENV                = "${params.ENVIRONMENT}"
        BROWSERSTACK_USERNAME   = credentials('BROWSERSTACK_USERNAME')
        BROWSERSTACK_ACCESS_KEY = credentials('BROWSERSTACK_ACCESS_KEY')
        BROWSERSTACK_BUILD_NAME = "Build #${BUILD_NUMBER} | ${BRANCH_NAME} | Jenkins"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('📦 Install Dependencies') {
            steps {
                echo "🚀 OpenText Playwright AI Framework"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "Browser:     ${params.BROWSER}"
                echo "Environment: ${params.ENVIRONMENT}"
                echo "Suite:       ${params.TEST_SUITE}"
                echo "Platform:    ${params.EXECUTION_PLATFORM}"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                sh 'npm ci'
            }
        }

        stage('🎭 Install Playwright Browsers') {
            when {
                expression { params.EXECUTION_PLATFORM == 'local' }
            }
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('🧹 Lint Check') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('🧪 Run Tests') {
            steps {
                script {
                    // Build the grep filter
                    def grepFilter = ''
                    if (params.CUSTOM_GREP?.trim()) {
                        grepFilter = "--grep '${params.CUSTOM_GREP}'"
                    } else {
                        switch(params.TEST_SUITE) {
                            case 'smoke':      grepFilter = '--grep @Smoke'; break
                            case 'regression': grepFilter = '--grep @Regression'; break
                            case 'header':     grepFilter = '--grep @Header'; break
                            case 'homepage':   grepFilter = '--grep @Homepage'; break
                            case 'responsive': grepFilter = '--grep @Responsive'; break
                            default:           grepFilter = ''; break
                        }
                    }

                    // Build the project filter
                    def projectFilter = ''
                    if (params.BROWSER != 'all') {
                        projectFilter = "--project=${params.BROWSER}"
                    }

                    // Execute on BrowserStack or locally
                    def exitCode
                    if (params.EXECUTION_PLATFORM == 'browserstack') {
                        exitCode = sh(
                            script: "npm run test:bstack -- ${projectFilter} ${grepFilter}",
                            returnStatus: true
                        )
                    } else {
                        exitCode = sh(
                            script: "npx playwright test ${projectFilter} ${grepFilter}",
                            returnStatus: true
                        )
                    }

                    env.TEST_EXIT_CODE = exitCode.toString()
                    if (exitCode != 0) {
                        unstable('⚠️ Some tests failed — check the TTA Report.')
                    }
                }
            }
        }
    }

    post {
        always {
            // Archive all reports
            archiveArtifacts(artifacts: 'tta-report/**', allowEmptyArchive: true, fingerprint: true)
            archiveArtifacts(artifacts: 'playwright-report/**', allowEmptyArchive: true)
            archiveArtifacts(artifacts: 'test-results/**', allowEmptyArchive: true)
            archiveArtifacts(artifacts: 'log/**', allowEmptyArchive: true)

            // Publish HTML Reports (requires HTML Publisher plugin)
            publishHTML(target: [
                allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,
                reportDir: 'tta-report', reportFiles: 'index.html', reportName: 'TTA Report'
            ])

            publishHTML(target: [
                allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,
                reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Report'
            ])
        }

        failure {
            echo '❌ Tests FAILED! Check the AIC Debug Report in tta-report/AIC_DEBUG_REPORT.md'
        }

        success {
            echo '✅ All tests PASSED!'
        }

        cleanup {
            cleanWs()
        }
    }
}
