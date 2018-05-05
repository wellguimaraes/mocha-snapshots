const _options = {
  sanitizeClassNames: true
}

module.exports.setup = (options) => {
  _options.sanitizeClassNames = options.sanitizeClassNames
}

module.exports.getOptions = () => _options