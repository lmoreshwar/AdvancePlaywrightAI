const fs = require('fs');
const path = require('path');

const repoRoot = __dirname;

const files = [
  'FRAMEWORK_HUB/02_Execution_Guides/MASTER_EXECUTION_GUIDE.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_NEW_AUTOMATION.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_MODIFY_IMPROVE.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_DEBUG_REPORT.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_VISUAL_AUTOMATION.md',
];

function readPossiblyUtf16(filePath) {
  const buf = fs.readFileSync(filePath);
  // Heuristic: lots of NUL bytes means UTF-16LE
  const sample = buf.subarray(0, Math.min(buf.length, 2000));
  let nulCount = 0;
  for (const b of sample) if (b === 0x00) nulCount++;
  const looksUtf16 = nulCount > sample.length * 0.1;

  if (looksUtf16) {
    return buf.toString('utf16le');
  }
  return buf.toString('utf8');
}

function sanitizeMarkdown(content) {
  // Remove replacement characters introduced by bad decoding
  content = content.replace(/\uFFFD/g, '');

  // Normalize common punctuation
  content = content
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/→/g, '->')
    .replace(/←/g, '<-');

  // Remove emojis / pictographs and variation selectors (keeps normal text)
  // Requires Node 16+ for Unicode property escapes.
  content = content
    .replace(/[\uFE0F\u200D]/g, '') // VS16 + ZWJ remnants
    .replace(/\p{Extended_Pictographic}+/gu, '');

  // Clean up leftover odd bytes that sometimes remain as Latin-1 symbols
  content = content.replace(/[ðâï][^\n\r]{0,6}/g, (m) => {
    // Only strip if it's one of the known mojibake lead chars
    if (/^(ð|â|ï)/.test(m)) return '';
    return m;
  });

  // Collapse double spaces created by emoji stripping in headings
  content = content.replace(/[ \t]{2,}/g, ' ');

  // Normalize newlines
  content = content.replace(/\r\n/g, '\n');

  return content;
}

for (const rel of files) {
  const abs = path.join(repoRoot, rel);
  let content = readPossiblyUtf16(abs);
  content = sanitizeMarkdown(content);
  fs.writeFileSync(abs, content, 'utf8');
  console.log('Sanitized: ' + rel);
}

console.log('Done');
