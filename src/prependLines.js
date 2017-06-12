module.exports = function(prefix) {
  return text => `${prefix}${text.trim().split('\n').join(`\n ${prefix}`)}\n`;
};