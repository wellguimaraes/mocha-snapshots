const ShallowWrapper  = require('enzyme').ShallowWrapper;
const ReactWrapper    = require('enzyme').ReactWrapper;
const clearClassNames = require('./clearClassNames');
const normalize       = require('./normalize');
const toJson          = require('enzyme-to-json').default;

module.exports = function getNormalizedTarget(target) {
  if (target instanceof ShallowWrapper || target instanceof ReactWrapper)
    target = clearClassNames(toJson(target));

  return normalize(target);
};