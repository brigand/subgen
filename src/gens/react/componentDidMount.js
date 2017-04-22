// @flow
import getIndent from '../../utils/getIndent';
import jsGetLandmarks from '../utils/jsGetLandmarks';

// TODO: object type annotation
const componentDidMount = (code: string) : string => {
  const lines = code.split(/\r?\n/g);
  const indent = getIndent(code);
  const { methods, classes } = jsGetLandmarks(code);

  const firstClass = classes[0];

  if (!firstClass) throw new Error(`No class found.`);

  const ctorMethod = methods.find(({ name }) => name === `constructor`);
  const cdmMethod = methods.find(({ name }) => name === `componentDidMount`);

  if (cdmMethod) {
    return code;
  }

  const newLines = [
    `${indent}componentDidMount() {`,
    `${indent}}`,
  ];

  if (ctorMethod) {
    lines.splice(ctorMethod.end + 1, 0, ``, ...newLines);
  } else {
    lines.splice(firstClass.start + 1, 0, ...newLines);
  }

  return lines.join(`\n`);
};

export default componentDidMount;
