const ShallowWrapper  = require('enzyme').ShallowWrapper;
const ReactWrapper    = require('enzyme').ReactWrapper;
const toJson          = require('enzyme-to-json').default;
const clearClassNames = require('./clearClassNames');
const normalize       = require('./normalize');

module.exports = function(target) {
  if (target instanceof ShallowWrapper || target instanceof ReactWrapper)
    target = clearClassNames(toJson(target));

  return normalize(target);
};