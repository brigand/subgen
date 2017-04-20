// @flow
const isAtIndent = (line: string, indent: string, levels: number) : boolean => {
  if (!levels) {
    return /^(\S|\s*$)/.test(line);
  }
  const expected = indent.repeat(levels);
  const startsWithIndent = line.indexOf(expected) === 0;
  const endsInNonWhitespace = /\S/.test(line.slice(expected.length)[0]);
  return startsWithIndent && endsInNonWhitespace;
};

export default isAtIndent;
