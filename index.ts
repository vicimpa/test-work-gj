const numMask = 0b111111;
const nextMask = 0b1000000;

export const serializer = (numbers: number[]): string => {
  const output: number[] = [];

  numbers.forEach((num) => {
    let first = true;
    while (num) {
      if (output.length && !first) {
        output.push(
          output.pop()! | nextMask
        );
      }

      output.push(num & numMask);
      num >>= 6;
      first = false;
    }
  });

  return output.map(char => String.fromCharCode(char)).join('');
};

export const deserializer = (string: string): number[] => {
  const output: number[] = [];
  let hasPreview = false;

  for (const char of string) {
    const code = char.charCodeAt(0);
    let preview = 0;
    let num = (code & numMask);

    if (hasPreview) {
      if (!output.length)
        throw new Error('Incorrect format');

      num <<= 6;
      preview = output.pop()!;
    }

    output.push(num | preview);
    hasPreview = !!(code & nextMask);
  }

  return output;
};