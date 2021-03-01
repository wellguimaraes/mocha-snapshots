const jsDiff              = require('diff')
const path                = require('path')
const stringify           = require('./stringify')
const getPrintableDiff    = require('./getPrintableDiff')
const getExistingSnaps    = require('./getExistingSnaps')
const getNormalizedTarget = require('./getNormalizedTarget')
const persistSnaps        = require('./persistSnaps')
const getTestName         = require('./getTestName')
const getOptions          = require('./setup').getOptions

const snapshotExtension     = '.mocha-snapshot'
const snapshotsFolder       = '__snapshots__'
const shouldUpdateSnapshots = parseInt(process.env.UPDATE, 10) || process.argv.includes('--update')

module.exports = function (value, context) {
  const options          = getOptions()
  const dirName          = path.dirname(context.runnable.file)
  const fileName         = path.basename(context.runnable.file)
  const snapshotDir      = path.join(dirName, snapshotsFolder)
  const snapshotFilePath = path.join(snapshotDir, fileName + snapshotExtension)
  const testName         = getTestName(context) + '(' + (context.titleIndex++) + ')'
  const snaps            = getExistingSnaps(snapshotDir, snapshotFilePath)
  const target           = options.normalize ? getNormalizedTarget(value) : value

  let snapDidChange = true

  if (snaps.hasOwnProperty(testName)) {
    const existingSnap = stringify(snaps[ testName ], true)
    const newSnap      = stringify(target)
    const diffResult   = jsDiff.diffLines(existingSnap, newSnap)

    snapDidChange = diffResult.some(it => it.removed || it.added)

    if (snapDidChange && !shouldUpdateSnapshots) {
      const output = getPrintableDiff(diffResult)
      throw new Error('Snapshot didn\'t match' + output)
    }
  }

  if (snapDidChange) {
    snaps[ testName ] = target
    persistSnaps(snaps, snapshotFilePath)
  }
}
