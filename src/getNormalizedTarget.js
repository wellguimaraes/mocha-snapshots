const ShallowWrapper  = require('enzyme').ShallowWrapper
const ReactWrapper    = require('enzyme').ReactWrapper
const toJson          = require('enzyme-to-json').default
const clearClassNames = require('./clearClassNames')
const normalize       = require('./normalize')
const getOptions      = require('./setup').getOptions

module.exports = function (value) {
  const options = getOptions()

  const isReactComponent      = value instanceof ShallowWrapper || value instanceof ReactWrapper
  const shouldClearClassNames = options.sanitizeClassNames && isReactComponent

  if (shouldClearClassNames) {
    return clearClassNames(normalize(toJson(value)))
  }

  return isReactComponent
    ? normalize(toJson(value))
    : normalize(value)
}