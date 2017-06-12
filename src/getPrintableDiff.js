const prependLines = require('./prependLines');
const colors       = require('colors/lib/colors');

module.exports = function getPrintableDiff(diff) {
  var output = '\n\n';

  var prependAddition = prependLines('  + ');
  var prependRemoval  = prependLines('  - ');

  diff.forEach(function(it) {
    if (it.added || it.removed) {
      output += it.added
        ? colors.green(prependAddition(it.value))
        : colors.red(prependRemoval(it.value))
    }
  });

  return output;
};