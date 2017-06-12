module.exports = function normalize(obj) {
  if (obj === null)
    return null;

  if (obj === undefined)
    return undefined;

  if (Array.isArray(obj))
    return obj.map(function(it) { return normalize(it) });

  if (typeof obj === 'function')
    return obj.name || '[function]';

  if (typeof obj === 'object')
    return Object.keys(obj).reduce(function(prev, key) {
      if (/^$$/.test(key)) return prev;

      prev[ key ] = normalize(obj[ key ]);
      return prev;
    }, {});

  return obj;
};