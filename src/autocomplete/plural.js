const pluralize = require('pluralize')

const choice = require('./choice').default

const plural = name => choice(name, pluralize(name))

module.exports = {
  default: plural
}
