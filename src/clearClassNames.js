module.exports = function clearClassNames(target) {
  if (!target)
    return target;

  if (Array.isArray(target))
    return target.map(it => clearClassNames(it));

  if (typeof target === 'object') {
    return Object.keys(target).reduce((prev, key) => {
      let isClassNameProp = /className/i.test(key) && typeof target[ key ] === 'string';

      prev[ key ] = isClassNameProp
        ? target[ key ].replace(/[-_]\w+/g, '')
        : clearClassNames(target[ key ]);

      return prev;
    }, {});
  }

  return target;
};