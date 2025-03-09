const fs = require('fs');
const path = require('path');

const args: string[] = process.argv.slice(2);

function generateColoredHTMLArray(arr: any[], level: number = 1): string {
  let result: string = '<ul>';

  let color: string;
  switch (level) {
    case 1:
      color = 'red';
      break;
    case 2:
      color = 'blue';
      break;
    case 3:
      color = 'green';
      break;
    case 4:
      color = 'purple';
      break;
    default:
      color = 'yellow';
  }


  for (const item of arr) {

    if (Array.isArray(item)) {
      result += `<li style="color: ${color};">${generateColoredHTMLArray(item, level + 1)}</li>`;
    } else {
      result += `<li style="color: ${color};">${item}</li>`;
    }
  }

  result += '</ul>';
  return result;
}

function showHelp(): void {
  console.log(
    `
    Usage: npx ts-node src/types_def_cli <array>
    Example: npx ts-node src/types_def_cli '[["a", "b", "c"], ["d", ["e", "f"]]]'
    `
  );
}

function preprocessArrayString(input: string): string {
  return input.replace(/([a-zA-Z_][a-zA-Z0-9_]*)/g, '"$1"');
}

function processArray(args: string[]): void {

  if (args.length === 0) {
    showHelp();
    return;
  }

  const arrayString: string = args[0];

  try {
    const processedString = preprocessArrayString(arrayString);
    const array: any[] = JSON.parse(processedString);
    const arrayHTML: string = generateColoredHTMLArray(array);

    const fullHTML: string = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Array</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
  </style>
</head>
<body>
  <h1>Generated Array</h1>
  ${arrayHTML}
</body>
</html>
    `;

    const outputDir = path.join(__dirname, 'create_array_output');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, 'array.html');
    fs.writeFileSync(outputPath, fullHTML);

    console.log(`HTML file created at: ${outputPath}`);
  } catch (err) {
    console.error('Invalid array format. Please provide a valid JSON array.');
    showHelp();
  }
}

processArray(args);