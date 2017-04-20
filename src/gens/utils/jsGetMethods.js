// @flow
import getIndent from '../../utils/getIndent';
import isAtIndent from '../../utils/isAtIndent';

export type MethodInfo = {
  name: string,
  start: number,
  end: number,
};

const jsGetMethods = (code: string) : Array<MethodInfo> => {
  const lines = code.split(/\r?\n/g);
  const indent = getIndent(code);
  const methods = [];
  let currentMethod = null;
  let isClass = false;

  lines.forEach((line, i) => {
    const tline = line.trim();

    if (line[0] === `}`) {
      isClass = false;
      return;
    }

    if (isClass) {
      // if is indented exactly one level
      if (isAtIndent(line, indent, 1)) {
        if (!currentMethod) {
          // get the method name
          // TODO: parse arguments
          const match = tline.match(/^([a-zA-Z0-9_$]+)\(/);
          if (match && match[1]) {
            currentMethod = {
              name: match[1],
              start: i,
              end: -1,
            };
          }
        } else if (tline === `}`) {
          currentMethod.end = i;
          methods.push(currentMethod);
          currentMethod = null;
        }
      }
    }

    if (/^(class|export default class|export const [A-Z][A-Za-z0-9$_]* = class)/.test(line)) {
      isClass = true;
    }
  });

  return methods;
};

export default jsGetMethods;
