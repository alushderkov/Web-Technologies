import fs from 'fs';
import {Command} from 'commander';
import path from 'path';
import chalk from "chalk";

const commander = new Command();

function generateTableHTML(numRows: number): string {
  let result: string = '<table border="1">';

  for (let i: number = 1; i <= numRows; i++) {
    result += `<tr><td>Row ${i}</td></tr>`;
  }

  result += '</table>';

  return result;
}

function enhanceTableWithGradient(tableHTML: string, numRows: number): string {
  const result: Array<string> = tableHTML.split('</tr>');

  for (let i: number = 1; i <= numRows; i++) {

    const intensity: number =
      Math.floor((255 / (numRows - 1)) * (i - 1));

    const hexColor: string =
      `#${intensity.toString(16).padStart(2, '0').repeat(3)}`;

    const rowIndex: number =
      result.findIndex(line => line.includes(`<td>Row ${i}</td>`));

    if (rowIndex !== -1) {
      result[rowIndex] = result[rowIndex]
        .replace('<tr>', `<tr style="background-color: ${hexColor};">`);
    }
  }

  return result.join('</tr>') + '</tr></table>';
}

function createHTMLFile(fullHTML: string): void {
  const outputDir: string = path.join(__dirname, 'create_table_output');

  if ( !fs.existsSync(outputDir) ) {
    fs.mkdirSync(outputDir);
  }

  const outputPath: string = path.join(outputDir, 'table.html');
  fs.writeFileSync(outputPath, fullHTML);

}

commander
  .version('1.0.0')
  .description('HTML Table');

commander
  .command('create <rows_number>')
  .option('--colour', 'Adds table colour')
  .alias('c')
  .description('Creates HTML document with table')
  .action( (rows_number: any, cmd: any): void => {
    rows_number = Number(rows_number);

    if ( isFinite(rows_number) ) {

        let tableHTML: string = generateTableHTML(rows_number);

        if (cmd.colour) {
          tableHTML = enhanceTableWithGradient(tableHTML, rows_number);
        }

        const fullHTML: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Array</title>
          <style>
            body {
              background-color: antiquewhite;
              font-family: Arial, sans-serif;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Generated Table</h1>
          ${tableHTML}
        </body>
        </html>
      `

      try {
        createHTMLFile(fullHTML);
        console.log(
          chalk.green(`Created successfully`)
        );

      } catch (err) {
        console.log(
          chalk.red(`Creating error`)
        );
      }

    } else {
      console.log(
        chalk.red(`Error argument`)
      );
    }


  });

commander.parse(process.argv);