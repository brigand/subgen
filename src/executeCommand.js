/* eslint global-require: 0 */
// @flow
import { promisify } from 'bluebird';

type Opts = {
  type: string,
  file: string,
}

const executeCommand = async (opts : Opts, mocks = {}) : Promise<string> => {
  if (!opts.type) {
    throw new Error(`Type not provided`);
  }
  if (!opts.file) {
    throw new Error(`File not provided`);
  }
  const fs = mocks.fs || require('fs');
  const readFile = promisify(fs.readFile);
  const contents = await readFile(opts.file, 'utf-8');
  const mod = getModule(opts.type);
  return mod(contents);
};

type Command = (code: string) => string;

const getModule = (type) : Command => {
  switch (type) {
    case 'componentDidMount':
      return require('./gens/react/componentDidMount').default;
    default:
      throw new Error(`Invalid type "${type}"`);
  }
};

export default executeCommand;
