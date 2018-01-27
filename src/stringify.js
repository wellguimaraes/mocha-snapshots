function ignoreNulls(key,value) {
  if (value === null) return undefined
  return value
}

module.exports = function stringify(obj) {
  return JSON.stringify(obj, ignoreNulls, '  ');
};
