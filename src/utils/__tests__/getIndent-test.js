import getIndent from '../getIndent';

const makeStr = indent => `

${indent}foo
${indent}${indent}bar
${indent}baz
`;

it(`works for one space`, () => {
  expect(getIndent(makeStr(` `))).toBe(` `);
});

it(`works for two spaces`, () => {
  expect(getIndent(makeStr(`  `))).toBe(`  `);
});

it(`works for four spaces`, () => {
  expect(getIndent(makeStr(`    `))).toBe(`    `);
});

it(`works for one tab`, () => {
  expect(getIndent(makeStr(`\t`))).toBe(`\t`);
});
