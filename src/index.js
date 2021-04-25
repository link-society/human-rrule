const { tokenize } = require('./parser')
const { rrule } = require('./grammar')
const { visitRRule } = require('./visit')
const autocomplete = require('../dist/autocomplete')

const parseHumanRRule = rrulestr => {
  const tokens = tokenize(rrulestr)
  const [ast, remaining] = rrule(tokens)

  if (remaining.length > 0) {
    throw new Error(`Could not parse: ${rrulestr}`)
  }

  return visitRRule(ast)
}

module.exports = {
  parseHumanRRule,
  autocomplete
}
