// TODO: optimize to not need split
const getIndent = (code) => {
  const lines = code.split(/\r?\n/g);
  let isInComment = false;

  for (const line of lines) {
    if (line.trim().indexOf(`/*`) === 0) {
      isInComment = true;
    } else if (isInComment) {
      if (line.indexOf(`*/`) !== -1) {
        isInComment = false;
      }
    } else if (line[0] === `\t`) {
      return `\t`;
    } else if (line[0] === ` `) {
      return line.match(/^ +/)[0];
    }
  }

  // no indentation, so assume two spaces
  return `  `;
};

export default getIndent;
