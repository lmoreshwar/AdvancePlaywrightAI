const fs = require('fs');
const path = require('path');
const base = __dirname;

const files = [
  'FRAMEWORK_HUB/02_Execution_Guides/AI_AUTOMATION_PLAYBOOK.md',
  'FRAMEWORK_HUB/02_Execution_Guides/PERCY_APPROVAL_REVIEW_PLAYBOOK.md',
  'FRAMEWORK_HUB/02_Execution_Guides/PLAYWRIGHT_CLI_ENFORCEMENT.md',
  'FRAMEWORK_HUB/02_Execution_Guides/TEST_COMMANDS.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_NEW_AUTOMATION.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_MODIFY_IMPROVE.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_DEBUG_REPORT.md',
  'FRAMEWORK_HUB/03_AI_Commands/PROMPT_VISUAL_AUTOMATION.md'
];

// Targeted string replacements for remaining garbled patterns
const replacements = [
  // Variation selector remnants (ï¸ = garbled EF B8 with 8F dropped)
  [/\u{1F6E0}\u00EF\u00B8/gu, '\u{1F6E0}\uFE0F'],     // 🛠️
  [/\u{1F5E3}\u00EF\u00B8/gu, '\u{1F5E3}\uFE0F'],     // 🗣️
  [/\u26A0\u00EF\u00B8/gu, '\u26A0\uFE0F'],             // ⚠️
  [/\u2B50\u00EF\u00B8/gu, '\u2B50\uFE0F'],             // ⭐
  [/\u{1F5C2}\u00EF\u00B8/gu, '\u{1F5C2}\uFE0F'],     // 🗂️
  [/\u{1F6E1}\u00EF\u00B8/gu, '\u{1F6E1}\uFE0F'],     // 🛡️
  [/\u{1F441}\u00EF\u00B8/gu, '\u{1F441}\uFE0F'],     // 👁️
  // Standalone garbled variation selectors
  [/\u00EF\u00B8\u0178/g, '\uFE0F'],
  [/\u00EF\u00B8$/gm, '\uFE0F'],
  [/\u00EF\u00B8(?=[^a-zA-Z0-9])/g, '\uFE0F'],
  // Garbled partial 4-byte emojis (last byte was undefined in CP1252, so was dropped)
  // 👁 = F0 9F 91 81 → ðŸ' (81 dropped) + ï¸ variation selector  
  [/\u00F0\u0178\u2018\u00EF\u00B8/g, '\u{1F441}\uFE0F'],    // 👁️
  [/\u00F0\u0178\u2018/g, '\u{1F441}'],                        // 👁 (without VS)  
  // 🔍 = F0 9F 94 8D → ðŸ" (8D dropped)
  [/\u00F0\u0178\u201D/g, '\u{1F50D}'],                        // 🔍
  // 📁 = F0 9F 93 81 → ðŸ" (81 dropped) - same pattern as 📋
  [/\u00F0\u0178\u201C/g, '\u{1F4CB}'],                        // 📋 (best guess)
  // ← = E2 86 90 → â† (90 dropped)
  [/\u00E2\u2020(?=[^a-zA-Z])/g, '\u2190'],                    // ←
  // Fix any remaining ï¸ that should be variation selectors
  [/([^\x00-\x7F])\u00EF\u00B8/g, '$1\uFE0F'],
];

files.forEach(f => {
  const fp = path.join(base, f);
  let content = fs.readFileSync(fp, 'utf8');
  
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  
  fs.writeFileSync(fp, content, 'utf8');
  
  // Check for remaining garbled chars
  const remaining = content.match(/[\u00F0][\u0178\u0153\u0152\u0160\u0161]|[\u00EF][\u00B8]/g);
  console.log(f + ': ' + (remaining ? 'REMAINING: ' + remaining.length + ' issues' : 'CLEAN'));
});

// Fix BOM in any execution guide if present
for (const f of files) {
  const fp = path.join(base, f);
  let c = fs.readFileSync(fp, 'utf8');
  if (c.charCodeAt(0) === 0xFEFF) {
    c = c.replace(/^\uFEFF/, '');
    fs.writeFileSync(fp, c, 'utf8');
    console.log('Stripped BOM from ' + f);
  }
}

console.log('Phase 2 complete!');

// Reverse map: Unicode codepoint -> CP1252 byte (only for 0x80-0x9F range)
const unicodeToCp1252 = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84,
  0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88,
  0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C,
  0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93,
  0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B,
  0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
};

function charToByte(cp) {
  if (cp <= 0x7F) return cp;
  if (cp >= 0xA0 && cp <= 0xFF) return cp;
  if (unicodeToCp1252[cp] !== undefined) return unicodeToCp1252[cp];
  return -1; // Not a valid CP1252 byte
}

function fixMojibake(str) {
  let result = '';
  let i = 0;
  const len = str.length;

  while (i < len) {
    const cp = str.codePointAt(i);
    const charLen = cp > 0xFFFF ? 2 : 1;
    const b = charToByte(cp);

    // If this char maps to a CP1252 byte >= 0x80, it might be a mojibake sequence
    if (b >= 0xC0 && b <= 0xF4) {
      // Potential UTF-8 lead byte. Try to collect continuation bytes.
      let seqLen = 0;
      if (b >= 0xC0 && b <= 0xDF) seqLen = 2;
      else if (b >= 0xE0 && b <= 0xEF) seqLen = 3;
      else if (b >= 0xF0 && b <= 0xF4) seqLen = 4;

      const bytes = [b];
      let j = i + charLen;
      let valid = true;

      for (let k = 1; k < seqLen && j < len; k++) {
        const nextCp = str.codePointAt(j);
        const nextCharLen = nextCp > 0xFFFF ? 2 : 1;
        const nextB = charToByte(nextCp);
        if (nextB >= 0x80 && nextB <= 0xBF) {
          bytes.push(nextB);
          j += nextCharLen;
        } else {
          valid = false;
          break;
        }
      }

      if (valid && bytes.length === seqLen) {
        // Decode these bytes as UTF-8
        const buf = Buffer.from(bytes);
        const decoded = buf.toString('utf8');
        if (!decoded.includes('\uFFFD')) {
          result += decoded;
          i = j;
          continue;
        }
      }
    }

    // Not a mojibake sequence, keep the original character
    result += String.fromCodePoint(cp);
    i += charLen;
  }

  return result;
}

files.forEach(f => {
  const fp = path.join(base, f);
  const content = fs.readFileSync(fp, 'utf8');
  const fixed = fixMojibake(content);
  fs.writeFileSync(fp, fixed, 'utf8');

  // Verify
  const check = fs.readFileSync(fp, 'utf8');
  const sample = check.substring(0, 100);
  const hasGarbled = /[\u00C0-\u00F4][\u0080-\u00BF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u2013-\u201D]/.test(sample);
  console.log('Fixed: ' + f + ' (first 50 chars: ' + check.substring(0, 50).replace(/\r?\n/g, ' ') + ')');
});

console.log('All done!');

// CP1252 bytes 0x80-0x9F map to these Unicode codepoints
const cp1252Specials = {
  0x20AC: 0x80, // €
  0x201A: 0x82, // ‚
  0x0192: 0x83, // ƒ
  0x201E: 0x84, // „
  0x2026: 0x85, // …
  0x2020: 0x86, // †
  0x2021: 0x87, // ‡
  0x02C6: 0x88, // ˆ
  0x2030: 0x89, // ‰
  0x0160: 0x8A, // Š
  0x2039: 0x8B, // ‹
  0x0152: 0x8C, // Œ
  0x017D: 0x8E, // Ž
  0x2018: 0x91, // '
  0x2019: 0x92, // '
  0x201C: 0x93, // "
  0x201D: 0x94, // "
  0x2022: 0x95, // •
  0x2013: 0x96, // –
  0x2014: 0x97, // —
  0x02DC: 0x98, // ˜
  0x2122: 0x99, // ™
  0x0161: 0x9A, // š
  0x203A: 0x9B, // ›
  0x0153: 0x9C, // œ
  0x017E: 0x9E, // ž
  0x0178: 0x9F, // Ÿ
};

function unicodeCharToCP1252Byte(cp) {
  if (cp < 0x80) return cp;       // ASCII
  if (cp <= 0xFF && (cp < 0x80 || cp > 0x9F)) return cp; // Latin-1 range (not 80-9F)
  if (cp1252Specials[cp] !== undefined) return cp1252Specials[cp];
  return null; // Can't map - not a CP1252 char
}

function fixDoubleMojibake(str) {
  const chars = [...str];
  const bytes = [];
  let i = 0;
  let result = '';
  
  while (i < chars.length) {
    const cp = chars[i].codePointAt(0);
    const byte = unicodeCharToCP1252Byte(cp);
    
    if (byte !== null && byte >= 0x80) {
      // This character could be part of a mojibake sequence
      // Collect consecutive high-byte chars
      const startI = i;
      const highBytes = [];
      
      while (i < chars.length) {
        const c = chars[i].codePointAt(0);
        const b = unicodeCharToCP1252Byte(c);
        if (b !== null && b >= 0x80) {
          highBytes.push(b);
          i++;
        } else if (b !== null && b >= 0xC0 && highBytes.length === 0) {
          // UTF-8 lead byte encoded as latin char
          highBytes.push(b);
          i++;
        } else {
          break;
        }
      }
      
      // Try to decode these bytes as UTF-8
      try {
        const buf = Buffer.from(highBytes);
        const decoded = buf.toString('utf8');
        // Check if decoding was successful (no replacement chars)
        if (!decoded.includes('\uFFFD') && decoded.length > 0) {
          result += decoded;
        } else {
          result += chars.slice(startI, i).join('');
        }
      } catch {
        result += chars.slice(startI, i).join('');
      }
    } else {
      result += chars[i];
      i++;
    }
  }
  
  return result;
}

// Simpler direct string replacement approach for known patterns
const directReplacements = {
  '\u00f0\u0178\u00a4\u2013': '\u{1F916}',  // 🤖 
  '\u00e2\u0153\u0085': '\u2705',             // ✅
  '\u00f0\u0178\u201c\u2039': '\u{1F4CB}',   // 📋
  '\u00f0\u0178\u0161\u00a6': '\u{1F6A6}',   // 🚦
  '\u00f0\u0178\u201d\u0178': '\u{1F57A}',   // edge case
  '\u00e2\u0161\u2122\u00ef\u00b8\u0178': '\u2699\uFE0F', // ⚙️
  '\u00f0\u0178\u00a7\u00aa': '\u{1F9EA}',   // 🧪
  '\u00f0\u0178\u203a\u00a1\u00ef\u00b8\u0178': '\u{1F6E1}\uFE0F', // 🛡️
  '\u00f0\u0178\u00a7\u00be': '\u{1F9FE}',   // 🧾
  '\u00f0\u0178\u00a7\u00a0': '\u{1F9E0}',   // 🧠
  '\u00f0\u0178\u2020\u2022': '\u{1F195}',   // 🆕
  '\u00f0\u0178\u203a\u00a0\u00ef\u00b8\u0178': '\u{1F6E0}\uFE0F', // 🛠️
  '\u00f0\u0178\u2019\u0081\u00ef\u00b8\u0178': '\u{1F441}\uFE0F', // 👁️
  '\u00f0\u0178\u00a7\u00a9': '\u{1F9E9}',   // 🧩
  '\u00f0\u0178\u00a7\u00af': '\u{1F9EF}',   // 🧯
  '\u00f0\u0178\u0178\u00af': '\u{1F3AF}',   // 🎯
  '\u00f0\u0178\u201d\u2018': '\u{1F511}',   // 🔑
  '\u00f0\u0178\u201c\u201a': '\u{1F4C2}',   // 📂
  '\u00e2\u0161\u00a0\u00ef\u00b8\u0178': '\u26A0\uFE0F', // ⚠️
  '\u00f0\u0178\u201c\u00160': '\u{1F4CA}',  // 📊 (alt form)
  '\u00e2\u0152\u0178': '\u274C',             // ❌
  '\u00e2\u00ad\u00ef\u00b8\u0178': '\u2B50\uFE0F', // ⭐
  '\u00f0\u0178\u2014\u201a\u00ef\u00b8\u0178': '\u{1F5C2}\uFE0F', // 🗂️
  '\u00f0\u0178\u0152\u0090': '\u{1F310}',   // 🌐
  '\u00f0\u0178\u201d\u00b4': '\u{1F534}',   // 🔴
  '\u00f0\u0178\u0161\u00a8': '\u{1F6A8}',   // 🚨
  '\u00f0\u0178\u201d\u00ac': '\u{1F52C}',   // 🔬
  '\u00f0\u0178\u201d\u00b8': '\u{1F4F8}',   // 📸
  '\u00f0\u0178\u201d\u2014': '\u{1F517}',   // 🔗
  '\u00f0\u0178\u2014\u00a3\u00ef\u00b8\u0178': '\u{1F5E3}\uFE0F', // 🗣️
  '\u00f0\u0178\u0178\u201c': '\u{1F393}',   // 🎓
  '\u00f0\u0178\u0161\u00ab': '\u{1F6AB}',   // 🚫
  '\u00f0\u0178\u201d\u00a7': '\u{1F527}',   // 🔧
  '\u00f0\u0178\u201d\u0178': '\u{1F4DD}',   // 📝
  '\u00e2\u2020\u2019': '\u2192',             // →
  '\u00e2\u20AC\u201c': '\u2014',             // — (em dash)
  '\u00e2\u20AC\u2122': "'",                  // ' (smart apostrophe)
  '\u00e2\u20AC\u0153': '\u201C',             // " (left smart quote)
  '\u00e2\u20AC\u009d': '\u201D',             // " (right smart quote)
  // Box-drawing chars
  '\u00e2\u2022\u201d': '\u2554',             // ╔ 
  '\u00e2\u2022\u2014': '\u2550',             // ═
  '\u00e2\u2022\u2014': '\u2557',             // ╗
  '\u00e2\u2022\u0161': '\u255A',             // ╚
  '\u00e2\u2022\u0178': '\u255D',             // ╝
  '\u00e2\u2022\u2019': '\u2551',             // ║
};

files.forEach(f => {
  const fp = path.join(base, f);
  let content = fs.readFileSync(fp, 'utf8');
  
  // Apply direct replacements
  for (const [bad, good] of Object.entries(directReplacements)) {
    while (content.includes(bad)) {
      content = content.split(bad).join(good);
    }
  }
  
  fs.writeFileSync(fp, content, 'utf8');
  
  // Verify
  const check = fs.readFileSync(fp, 'utf8');
  const hasGarbled = check.includes('\u00f0\u0178') || check.includes('\u00e2\u0153');
  console.log((hasGarbled ? 'STILL GARBLED' : 'CLEAN') + ': ' + f);
});

console.log('Done!');
