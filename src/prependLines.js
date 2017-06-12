module.exports = function prependLines(prefix) {
  return function(text) {
    return prefix + text.trim().split('\n').join('\n ' + prefix) + '\n';
  }
};