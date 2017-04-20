import isAtIndent from '../isAtIndent';

const makeTest = (code, indent, levels, shouldMatch) => {
  const name = indent === `\t` ? `one tab` : `${indent.length} spaces`;
  it(`${shouldMatch ? `positive` : `negative`} at indent ${name} with level ${levels}`, () => {
    expect(isAtIndent(code, indent, levels)).toBe(shouldMatch);
  });
};

makeTest(`foo`, `  `, 0, true);
makeTest(`  foo`, `  `, 0, false);
makeTest(`foo`, `\t`, 1, false);
makeTest(`\tfoo`, `\t`, 1, true);
makeTest(`  foo`, `  `, 1, true);
