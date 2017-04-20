// @flow
/* eslint-disable */
import getIndent from '../../utils/getIndent';
import jsGetLandmarks from '../utils/jsGetLandmarks';

// TODO: object type annotation
const componentDidMount = (code: string, opts: Object) : string => {
  const indent = getIndent(code);
  const { methods, classes } = jsGetLandmarks(code);

  const ctorMethod = methods.find(({name}) => name === `constructor`);
  const cdmMethod = methods.find(({name}) => name === `componentDidMount`);

  if (ctorMethod) {
    
  }

  return code;
};

export default componentDidMount;
