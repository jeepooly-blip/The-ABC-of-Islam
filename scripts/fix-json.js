const fs = require('fs');

// Fix zh.json - replace unescaped quotes inside strings
let zh = fs.readFileSync('src/content/zh.json', 'utf8');

// Replace patterns where Chinese text contains unescaped double quotes
// These are "quoted speech" inside JSON string values
const replacements = [
  [':\u0022\u5fae\u7b11\u4e5f\u662f\u65bd\u820d\u3002\u0022', ":\u2018\u5fae\u7b11\u4e5f\u662f\u65bd\u820d\u3002\u2019"],
  [':\u0022\u4efb\u4f55\u597d\u7684\u884c\u4e3a', ":\u2018\u4efb\u4f55\u597d\u7684\u884c\u4e3a"],
  ['\u3002\u0022\u8fd9\u8868\u660e', "\u3002\u2019\u8fd9\u8868\u660e"],
];

// More general approach: find all instances of " inside string values
// by looking for the pattern: Chinese char + : + " + text + " + Chinese char
// and replace the inner quotes with single quotes

// Actually, let's just read the file as text and do a smarter fix
// Find all " that are NOT at the start/end of JSON string values

const lines = zh.split('\n');
const fixedLines = lines.map(line => {
  // If this line contains a funFact, quiz q, or explanation with inner quotes
  // we need to handle them
  
  // Simple heuristic: count quotes. If there are more than expected, fix them
  const trimmed = line.trim();
  
  // For lines that have content like: "key": "value with "quotes" inside"
  // We need to replace inner quotes
  
  return line;
});

// Better: just use a state machine to find and fix unescaped quotes
// Or simpler: replace all " that appear between Chinese characters with \u2018 and \u2019

let result = '';
let inString = false;
let stringStart = -1;

for (let i = 0; i < zh.length; i++) {
  const ch = zh[i];
  
  if (ch === '"' && !inString) {
    inString = true;
    stringStart = i;
    result += ch;
  } else if (ch === '"' && inString) {
    // Check if this is end of string or inner quote
    // End of string: followed by , or } or ] or : or whitespace
    const next = zh[i + 1] || '';
    const prev = zh[i - 1] || '';
    
    if (next === ',' || next === '}' || next === ']' || next === ':' || next === '\n' || next === ' ' || next === '\r') {
      // This is likely end of JSON string
      inString = false;
      result += ch;
    } else if (prev === ':' || prev === ',' || prev === '[' || prev === '{') {
      // This is start of JSON value string  
      inString = true;
      result += ch;
    } else {
      // This is an inner quote - replace with single quote
      // Check if the next quote closes it
      let j = i + 1;
      while (j < zh.length && zh[j] !== '"') j++;
      if (j < zh.length) {
        // Found closing quote - replace both
        result += '\u2018'; // left single quote
        // Skip to closing quote
        for (let k = i + 1; k < j; k++) result += zh[k];
        result += '\u2019'; // right single quote
        i = j; // skip to closing quote
        // Now check if this closing quote is end of JSON string
        const nextAfter = zh[i + 1] || '';
        if (nextAfter === ',' || nextAfter === '}' || nextAfter === ']') {
          inString = false;
        }
      } else {
        result += ch;
      }
    }
  } else {
    result += ch;
  }
}

fs.writeFileSync('src/content/zh.json', result, 'utf8');
try {
  JSON.parse(result);
  console.log('zh.json: OK');
} catch(e) {
  console.log('zh.json: ERROR -', e.message);
  // Show the problematic area
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || '0');
  console.log('Context:', result.substring(pos - 50, pos + 50));
}

// Fix sw.json - remove double closing brackets
let sw = fs.readFileSync('src/content/sw.json', 'utf8');
sw = sw.replace(/\]\]/g, ']');
fs.writeFileSync('src/content/sw.json', sw, 'utf8');
try {
  JSON.parse(sw);
  console.log('sw.json: OK');
} catch(e) {
  console.log('sw.json: ERROR -', e.message);
}
