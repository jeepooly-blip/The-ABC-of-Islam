const fs = require('fs');
let zh = fs.readFileSync('src/content/zh.json', 'utf8');

// Strategy: Find " characters that are inside JSON string values 
// (not at JSON structural positions) and replace them with escaped versions
// or with single curly quotes

// Approach: parse char by char, tracking JSON string state
let result = '';
let inStr = false;
let i = 0;

while (i < zh.length) {
  const ch = zh[i];
  
  if (!inStr) {
    result += ch;
    if (ch === '"') inStr = true;
    i++;
  } else {
    if (ch === '\\') {
      // Escaped char - skip both
      result += zh[i] + zh[i+1];
      i += 2;
    } else if (ch === '"') {
      // Could be end of string or inner quote
      // Look ahead: valid JSON after end-of-string is , } ] : or whitespace
      let j = i + 1;
      while (j < zh.length && (zh[j] === ' ' || zh[j] === '\n' || zh[j] === '\r' || zh[j] === '\t')) j++;
      
      const nextNonSpace = zh[j] || '';
      if (nextNonSpace === ',' || nextNonSpace === '}' || nextNonSpace === ']' || nextNonSpace === ':') {
        // This IS the end of the JSON string
        result += ch;
        inStr = false;
        i++;
      } else {
        // This is an inner quote - replace with curly single quote
        // But we need to figure out if it's opening or closing
        // Look back: if preceded by : or space, it's opening
        const prev = result[result.length - 1];
        if (prev === ':' || prev === ' ' || prev === '\n') {
          result += '\u2018'; // opening single quote
        } else {
          result += '\u2019'; // closing single quote
        }
        i++;
      }
    } else {
      result += ch;
      i++;
    }
  }
}

fs.writeFileSync('src/content/zh.json', result, 'utf8');

try {
  JSON.parse(result);
  console.log('zh.json: VALID');
} catch(e) {
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || '0');
  console.log('zh.json: ERROR at pos', pos);
  console.log('Context:', JSON.stringify(result.substring(pos-30, pos+30)));
}
