module.exports = function() {
  if (process.env.CI)
    throw new Error('Snapshots can\'t be created on CI environment');
};