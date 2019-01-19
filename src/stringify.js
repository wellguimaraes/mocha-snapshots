const getOptions = require('./setup').getOptions

function ignoreNulls(key, value) {
  if (value === null) return undefined
  return value
}

module.exports = function stringify(obj, native = false) {
  if (native) {
    return JSON.stringify(obj, ignoreNulls, '  ')
  } else {
    let fn = getOptions().stringifyFunction
    if(fn === JSON.stringify) {
      return JSON.stringify(obj, ignoreNulls, '  ')
    } else {
      let json = getOptions().stringifyFunction(obj, ignoreNulls, '  ')
      return JSON.stringify(JSON.parse(json), ignoreNulls, '  ')
    }
  }
};
