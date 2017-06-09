const path           = require('path');
const fs             = require('fs');
const colors         = require('colors/lib/colors');
const jsDiff         = require('diff');
const ShallowWrapper = require('enzyme').ShallowWrapper;
const ReactWrapper   = require('enzyme').ReactWrapper;
const toJson         = require('enzyme-to-json');

var lastTestName  = '';
var testNameIndex = 0;

function stringify(obj) {
  return JSON.stringify(obj, null, '  ');
}

function getTestName(mochaContext) {
  var testName = mochaContext.test.fullTitle();

  if (lastTestName === testName) {
    testNameIndex++;
  } else {
    testNameIndex = 0;
    lastTestName  = testName;
  }

  return testName + '(' + testNameIndex + ')';
}

function prependLines(prefix) {
  return function(text) {
    return prefix + text.trim().split('\n').join('\n ' + prefix) + '\n';
  }
}

function normalize(obj) {
  if (obj === null)
    return null;

  if (obj === undefined)
    return undefined;

  if (Array.isArray(obj))
    return obj.map(function(it) { return normalize(it) });

  if (typeof obj === 'function')
    return obj.name || '[function]';

  if (typeof obj === 'object')
    return Object.keys(obj).reduce(function(prev, curr) {
      if (/^$$/.test(curr)) return prev;
      prev[ curr ] = normalize(obj[ curr ]);
      return prev;
    }, {});

  return obj;
}

function persist(snaps, snapshotFilePath) {
  const snapsFileContent = Object
    .keys(snaps)
    .reduce(function(prev, curr) {
      return prev + 'exports["' + curr + '"] = ' + stringify(snaps[ curr ]) + ';\n\n'
    }, '');

  fs.writeFileSync(snapshotFilePath, snapsFileContent, { flag: 'w' });
}

function getPrintableDiff(diff) {
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
}

module.exports = function(mochaContext) {
  return function(what) {
    const dirName          = path.dirname(mochaContext.test.file);
    const fileName         = path.basename(mochaContext.test.file);
    const snapshotDir      = path.join(dirName, '__snapshots__');
    const snapshotFilePath = path.join(snapshotDir, fileName + '.mocha-snapshot');
    const testName         = getTestName(mochaContext);

    var target = what;

    if (target instanceof ShallowWrapper || target instanceof ReactWrapper) {
      target = toJson(target);
    }

    if (!fs.existsSync(snapshotDir))
      fs.mkdirSync(snapshotDir);

    var snaps = {};

    if (fs.existsSync(snapshotFilePath))
      snaps = require(snapshotFilePath);

    const neutralizedWhat = normalize(target);

    if (snaps.hasOwnProperty(testName)) {
      const result    = jsDiff.diffLines(stringify(snaps[ testName ]), stringify(neutralizedWhat));
      const didChange = result.some(function(it) {
        return it.removed || it.added
      });

      if (didChange) {
        if (process.env.UPDATE) {
          snaps[ testName ] = neutralizedWhat;
          persist(snaps, snapshotFilePath);
        } else {
          const output = getPrintableDiff(result);
          throw new Error('Snapshot didn\'t match' + output);
        }
      }
    } else {
      snaps[ testName ] = neutralizedWhat;
      persist(snaps, snapshotFilePath);
    }
  }
};