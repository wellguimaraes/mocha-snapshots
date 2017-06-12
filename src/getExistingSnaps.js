const fs      = require('fs');
const checkCI = require('./checkCI');

module.exports = function getExistingSnaps(snapshotDir, snapshotFilePath) {
  var snaps = {};

  if (!fs.existsSync(snapshotDir)) {
    checkCI();
    fs.mkdirSync(snapshotDir);
  }

  if (fs.existsSync(snapshotFilePath))
    snaps = require(snapshotFilePath);
  else
    checkCI();

  return snaps;
};