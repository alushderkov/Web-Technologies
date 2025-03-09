const args: Array<string> = process.argv.slice(2);

function showHelp(): void {
  console.log(
    `
    Usage: npx ts-node src/biggest_word_cli[.ts] <...words>
    Options: none
    `
  );
}

function findLongestWords(words: Array<string>): Array<string> {
  let result: Array<string> = [];
  let maxLength: number = 0;

  for (const word of words) {
    if (word.length > maxLength) {
      maxLength = word.length;
    }
  }

  for (const word of words) {
    if (word.length === maxLength) {
      result.push(word);
    }
  }

  return result;
}

function processWords(args: Array<string>): void {
  if (args.length === 0) {
    showHelp();
  } else {
    const longestWords: Array<string> = findLongestWords(args);

    if (longestWords.length === 1) {
      console.log(`The longest word is: "${longestWords[0]}"`);
    } else {
      console.log(`The longest words are: "${longestWords.join('", "')}"`);
    }
  }
}

processWords(args);

export {};