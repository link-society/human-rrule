const { variable, unify } = require('junify')

const bind = variable

const match = (...patterns) => (...value) => {
  const matchs = patterns.map(rule => [
    unify(rule.slice(0, -1), value),
    rule.slice(-1)[0]
  ])
  const matching = matchs.filter(([unified]) => unified).slice(0, 1)

  if (matching.length === 0) {
    throw new Error('No matching pattern')
  }

  const [[unified, fn]] = matching
  return fn(unified)
}

const caseOf = (value, patterns) => match(...patterns)(value)

module.exports = { bind, match, caseOf }
