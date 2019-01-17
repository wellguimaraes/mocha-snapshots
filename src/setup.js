const defaultOptions = () => ({
  sanitizeClassNames: true,
  normalize: true,
  stringifyFunction: JSON.stringify
})

const _options = defaultOptions()

module.exports.setup = (options) => {
  Object.assign(_options, defaultOptions(), options)
}

module.exports.getOptions = () => _options