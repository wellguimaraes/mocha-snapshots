const getOptions = require('./setup').getOptions

function ignoreNulls(key,value) {
  if (value === null) return undefined
  return value
}

module.exports = function stringify(obj) {
  return getOptions().stringifyFunction(obj, ignoreNulls, '  ')
};
