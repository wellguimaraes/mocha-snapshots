const fs        = require('fs');
const stringify = require('./stringify');
const checkCI   = require('./checkCI');

module.exports = function persistSnaps(snaps, snapshotFilePath) {
  checkCI();

  const snapsFileContent = Object
    .keys(snaps)
    .reduce(function(prev, curr) {
      return prev + 'exports["' + curr + '"] = ' + stringify(snaps[ curr ]) + ';\n\n'
    }, '');

  fs.writeFileSync(snapshotFilePath, snapsFileContent, { flag: 'w' });
};