const prependLines = require('./prependLines');
const colors       = require('colors/lib/colors');

module.exports = function(diff) {
  let printable         = '\n\n';
  const prependAddition = prependLines('  + ');
  const prependRemoval  = prependLines('  - ');

  diff.forEach(it => {
    if (it.added || it.removed) {
      printable += it.added
        ? colors.green(prependAddition(it.value))
        : colors.red(prependRemoval(it.value))
    }
  });

  return printable;
};