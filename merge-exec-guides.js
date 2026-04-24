const fs = require('fs');
const path = require('path');

const repoRoot = __dirname;
const execDir = path.join(repoRoot, 'FRAMEWORK_HUB', '02_Execution_Guides');

const inputs = [
  'AI_AUTOMATION_PLAYBOOK.md',
  'PERCY_APPROVAL_REVIEW_PLAYBOOK.md',
  'PLAYWRIGHT_CLI_ENFORCEMENT.md',
  'TEST_COMMANDS.md',
].map(f => path.join(execDir, f));

const output = path.join(execDir, 'MASTER_EXECUTION_GUIDE.md');

const combined = inputs.map(fp => fs.readFileSync(fp, 'utf8').replace(/\r\n/g, '\n').trimEnd()).join('\n\n\n---\n\n\n') + '\n';
fs.writeFileSync(output, combined, 'utf8');
console.log('Wrote ' + output);
