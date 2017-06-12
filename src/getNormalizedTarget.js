const ShallowWrapper  = require('enzyme').ShallowWrapper;
const ReactWrapper    = require('enzyme').ReactWrapper;
const toJson          = require('enzyme-to-json').default;
const clearClassNames = require('./clearClassNames');
const normalize       = require('./normalize');

module.exports = function(target) {
  let shouldClearClassNames = target instanceof ShallowWrapper || target instanceof ReactWrapper;

  if (shouldClearClassNames)
    target = toJson(target);

  target = normalize(target);

  return shouldClearClassNames
    ? clearClassNames(target)
    : target;
};