const prettyFormat = require('pretty-format');
const ReactElement = prettyFormat.plugins.ReactElement;
const ReactTestComponent = prettyFormat.plugins.ReactTestComponent;


module.exports = function stringify(obj) {
  if (typeof obj === "string")
      return obj;
  return prettyFormat(obj, {
      plugins: [ReactElement, ReactTestComponent],
  });
};
