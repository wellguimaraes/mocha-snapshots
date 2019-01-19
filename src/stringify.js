const getOptions = require('./setup').getOptions

function ignoreNulls(key, value) {
  if (value === null) return undefined
  return value
}

module.exports = function stringify(obj, native = false) {
  let fn = native ? JSON.stringify : getOptions().stringifyFunction
  return fn(obj, ignoreNulls, '  ')
};
