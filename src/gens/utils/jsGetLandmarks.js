// @flow
import getIndent from '../../utils/getIndent';
import isAtIndent from '../../utils/isAtIndent';

export type MethodInfo = {
  type: 'method',
  name: string,
  start: number,
  end: number,
};

export type ClassInfo = {
  type: 'class',
  name: string,
  start: number,
  end: number,
};

export type Landmark = MethodInfo | ClassInfo;

export type Landmarks = {
  methods: Array<MethodInfo>,
  classes: Array<ClassInfo>,
};

const jsGetLandmarks = (code: string) : Landmarks => {
  const lines = code.split(/\r?\n/g);
  const indent = getIndent(code);
  const classes : Array<ClassInfo> = [];
  const methods : Array<MethodInfo> = [];

  let currentMethod : ?MethodInfo = null;
  let currentClass : ?ClassInfo = null;

  let isClass = false;

  lines.forEach((line, i) => {
    const tline = line.trim();

    if (currentClass && line[0] === `}`) {
      isClass = false;
      currentClass.end = i;
      classes.push(currentClass);
      currentClass = null;
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
              type: `method`,
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

    const classNameMatch = line.match(/^(class ([A-Z][A-Za-z0-9$_]*)|export default class ([A-Z][A-Za-z0-9$_]*)|export const ([A-Z][A-Za-z0-9$_]*) = class)/);
    if (classNameMatch) {
      const className = classNameMatch[2] || classNameMatch[3] || classNameMatch[4];
      isClass = true;
      currentClass = {
        type: `class`,
        name: className,
        start: i,
        end: -1,
      };
    }
  });

  return { methods, classes };
};

export default jsGetLandmarks;
