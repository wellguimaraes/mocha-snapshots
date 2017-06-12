const path              = require('path');
const fs                = require('fs');
const colors            = require('colors/lib/colors');
const jsDiff            = require('diff');
const ShallowWrapper    = require('enzyme').ShallowWrapper;
const ReactWrapper      = require('enzyme').ReactWrapper;
const toJson            = require('enzyme-to-json').default;
const Runnable          = require('mocha/lib/runnable');
const chai              = require('chai');
const originalRun       = Runnable.prototype.run;
const snapshotExtension = '.mocha-snapshot';
const snapshotsFolder   = '__snapshots__';

var currentTestName  = '';
var currentNameIndex = 0;
var currentRunnable  = null;

Runnable.prototype.run = function() {
  currentRunnable  = this;
  currentTestName  = this.title;
  currentNameIndex = 0;

  return originalRun.apply(this, arguments);
};

function stringify(obj) {
  return JSON.stringify(obj, null, '  ');
}

function getTestName() {
  return currentTestName + '(' + (currentNameIndex++) + ')';
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
    return Object.keys(obj).reduce(function(prev, key) {
      if (/^$$/.test(key)) return prev;

      prev[ key ] = normalize(obj[ key ]);
      return prev;
    }, {});

  return obj;
}

function persistSnaps(snaps, snapshotFilePath) {
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

function clearClassNames(target) {
  if (target === null)
    return null;

  if (target === undefined)
    return undefined;

  if (Array.isArray(target))
    return target.map(function(it) { return clearClassNames(it) });

  if (typeof target === 'function')
    return target;

  if (typeof target === 'object')
    return Object.keys(target).reduce(function(prev, key) {
      if (/className/i.test(key) && typeof target[ key ] === 'string')
        prev[ key ] = target[ key ].replace(/\d/g, '');
      else
        prev[ key ] = clearClassNames(target[ key ]);

      return prev;
    }, {});

  return target;

}

function checkCI() {
  if (process.env.CI)
    throw new Error('Snapshots can\'t be created on CI environment');
}

function getExistingSnaps(snapshotDir, snapshotFilePath) {
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
}

function getNormalizedTarget(target) {
  if (target instanceof ShallowWrapper || target instanceof ReactWrapper)
    target = clearClassNames(toJson(target));

  target = normalize(target);

  return target;
}

function matchSnapshot(what) {
  const dirName          = path.dirname(currentRunnable.file);
  const fileName         = path.basename(currentRunnable.file);
  const snapshotDir      = path.join(dirName, snapshotsFolder);
  const snapshotFilePath = path.join(snapshotDir, fileName + snapshotExtension);
  const testName         = getTestName();

  var snaps  = getExistingSnaps(snapshotDir, snapshotFilePath);
  var target = getNormalizedTarget(what);

  if (snaps.hasOwnProperty(testName)) {
    const result    = jsDiff.diffLines(stringify(snaps[ testName ]), stringify(target));
    const didChange = result.some(function(it) { return it.removed || it.added });

    if (didChange) {
      if (process.env.UPDATE) {
        snaps[ testName ] = target;
        persistSnaps(snaps, snapshotFilePath);
      } else {
        const output = getPrintableDiff(result);
        throw new Error('Snapshot didn\'t match' + output);
      }
    }
  } else {
    checkCI();

    snaps[ testName ] = target;
    persistSnaps(snaps, snapshotFilePath);
  }
}

global.matchSnapshot = matchSnapshot;

if (chai) {
  chai.util.addMethod(chai.Assertion.prototype, 'matchSnapshot', function() {
    var obj = chai.util.flag(this, 'object');
    matchSnapshot(obj);
  });
}