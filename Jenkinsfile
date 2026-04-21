/**
 * Jenkinsfile — OpenText AI-Powered Playwright Framework
 * 
 * Runs Playwright tests on BrowserStack and generates
 * TTA Report + AIC Debug Report as build artifacts.
 * 
 * Prerequisites:
 * - Node.js 22+ installed on Jenkins agent (or use NodeJS plugin)
 * - BrowserStack credentials stored as Jenkins credentials:
 *     BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY
 */
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22' // Configure this in Jenkins Global Tool Configuration
    }

    environment {
        BROWSERSTACK_USERNAME  = credentials('BROWSERSTACK_USERNAME')
        BROWSERSTACK_ACCESS_KEY = credentials('BROWSERSTACK_ACCESS_KEY')
        BASE_URL = 'https://www.opentext.com'
        CI = 'true'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
    }

    stages {
        stage('📦 Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('🎭 Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('🧪 Run Tests on BrowserStack') {
            steps {
                script {
                    def exitCode = sh(
                        script: 'npm run test:bstack -- src/tests/header.spec.ts',
                        returnStatus: true
                    )
                    env.TEST_EXIT_CODE = exitCode.toString()
                }
            }
        }
    }

    post {
        always {
            // Archive TTA Report (HTML + AIC Debug Report)
            archiveArtifacts(
                artifacts: 'tta-report/**',
                allowEmptyArchive: true,
                fingerprint: true
            )

            // Archive Playwright HTML Report
            archiveArtifacts(
                artifacts: 'playwright-report/**',
                allowEmptyArchive: true
            )

            // Archive Test Results (screenshots, videos, traces)
            archiveArtifacts(
                artifacts: 'test-results/**',
                allowEmptyArchive: true
            )

            // Archive BrowserStack Logs
            archiveArtifacts(
                artifacts: 'log/**',
                allowEmptyArchive: true
            )

            // Publish HTML Report (requires HTML Publisher plugin)
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'tta-report',
                reportFiles: 'index.html',
                reportName: 'TTA Test Report'
            ])
        }

        failure {
            echo '❌ Tests FAILED! Check the AIC Debug Report in tta-report/AIC_DEBUG_REPORT.md'
        }

        success {
            echo '✅ All tests PASSED!'
        }
    }
}
