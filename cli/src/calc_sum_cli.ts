const args: Array<string> = process.argv.slice(2);

function showHelp(): void {
  console.log(
    `
    Usage: npx ts-node src/calc_sum_cli <...arguments>
    Options: none
    `
  );
}

function isInteger(arg: number) : boolean {
  let result: boolean = false;

  try {
    BigInt(arg);
    result = true;

  } catch {}

  return result;
}

function calcSumRanks(aNumber: number): number {
  let result: number = 0;
  let dividend: number = aNumber;
  let mod: number = 1;

  try {

    while (dividend) {
      mod = dividend % 10;
      dividend = Math.floor(dividend / 10);

      result += mod;
    }

  } catch (err) {

    console.log(`Error in calcSumRanks: ${err}`);
    result = -1;
  }

  return result;
}

function sumForArguments(args: Array<string>): void {

  if (args.length === 0) {
    showHelp();
  } else {

    for (let i: number = 0; i < args.length; i++) {

      if ( isInteger( Number(args[i]) ) ) {
        console.log(`Rank sum in number ${args[i]} is ${calcSumRanks( Number( args[i] ) )}`);
      }
    }
  }
}

sumForArguments(args);

export {};