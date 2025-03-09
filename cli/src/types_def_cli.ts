const args: Array<string> = process.argv.slice(2);

function showHelp(): void {
  console.log(
    `
    Usage: npx ts-node src/types_def_cli <...arguments>
    Options: none
    `
  );
}

function typeOf(arg: string): string  {

  function defIntOrFloat(arg: string) : string {
    let result: string = `float`;

    try {
      BigInt(arg);
      result = `int`;

    } catch {}

    return result;
  }

  let result: string = `string`;

  if ( isFinite( Number(arg) ) ) {
    result = defIntOrFloat(arg);
  }

  return result;
}

function outputTypes(args: Array<string>): void {

  if (args.length === 0) {
    showHelp();

  } else {

    for (let i: number = 0; i < args.length; i++) {

      if ( args[i] ) {
        console.log(`Type of ${args[i]} is ${typeOf(args[i])}`);
      }
    }
  }
}

outputTypes(args);

export {};