# BrowserStack Execution Fix & Targeted Run

The current BrowserStack execution is failing due to an invalid browser name (`safari`) in the configuration, which Playwright's BrowserStack SDK does not recognize. Additionally, we need to target only the Desktop Chrome platform as requested.

## Proposed Changes

### 🔧 Configuration Fixes

#### [MODIFY] [browserstack.yml](file:///c:/Users/DELL/AI%20Workspace/OpenText/browserstack.yml)
- Change `browserName: safari` to `browserName: playwright-webkit`. This resolves the `Error: Invalid 'browser'` message.
- Temporarily comment out other platforms (Edge, Safari, Firefox) to ensure the run targets **ONLY** Desktop Chrome as requested.

### 🧪 Execution Plan

1. **Verify Config**: Ensure `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` are still valid in `.env`.
2. **Run Targeted Test**: Execute the command specifically for the Customer Stories spec:
   ```bash
   npm run test:bstack -- src/tests/customer-stories.spec.ts --project=desktop-chrome
   ```

## Verification Plan

### Automated Tests
- I will run the command and monitor the output using `command_status`.
- I will verify that ONLY one session (Windows Chrome) is created on the BrowserStack Automate dashboard.
- I will confirm the results are reported back to the console correctly.
