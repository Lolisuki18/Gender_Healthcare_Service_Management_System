const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  'src',
  'components',
  'StaffProfile',
  'STITestManagementContent.js'
);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('Reading file...');

  // Simple check for bracket balance
  let openBraces = 0;
  let openParens = 0;
  let openBrackets = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (char === '(') openParens++;
    if (char === ')') openParens--;
    if (char === '[') openBrackets++;
    if (char === ']') openBrackets--;

    // Check for imbalance
    if (openBraces < 0) console.log(`Extra closing brace at position ${i}`);
    if (openParens < 0)
      console.log(`Extra closing parenthesis at position ${i}`);
    if (openBrackets < 0) console.log(`Extra closing bracket at position ${i}`);
  }

  console.log('Final counts:');
  console.log(`Braces: ${openBraces}`);
  console.log(`Parentheses: ${openParens}`);
  console.log(`Brackets: ${openBrackets}`);

  if (openBraces === 0 && openParens === 0 && openBrackets === 0) {
    console.log('File structure appears balanced!');
  } else {
    console.log('File structure is unbalanced!');
  }

  // Check if we can parse the file
  try {
    require(filePath);
    console.log('File parsed successfully!');
  } catch (parseError) {
    console.log('Parse error:', parseError.message);

    // Try to identify line number from error message
    const lineMatch = parseError.message.match(/\((\d+):(\d+)\)/);
    if (lineMatch) {
      const errorLine = parseInt(lineMatch[1]);
      console.log(`Error near line ${errorLine}`);

      // Show a few lines around the error
      const lines = content.split('\n');
      console.log('\nCode context:');
      for (
        let i = Math.max(0, errorLine - 5);
        i < Math.min(lines.length, errorLine + 5);
        i++
      ) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
    }
  }
} catch (error) {
  console.error('Error reading or processing file:', error);
}
