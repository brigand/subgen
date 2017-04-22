/* eslint no-console: 0 */
// @flow
import yargs from 'yargs';
import executeCommand from './executeCommand';

let commanded = false;

const { argv } = yargs
  .command(`gen <type> <file>`, `generates some code in a file`, {}, (cmd) => {
    commanded = true;
    const res = executeCommand({
      type: cmd.type,
      file: cmd.file,
      extras: cmd,
    });
    if (cmd.write) {
      console.error(`Writing isn't currently supported`);
    } else {
      console.log(res);
    }
  });


if (!commanded) {
  console.log(`argv2`, argv);
}
