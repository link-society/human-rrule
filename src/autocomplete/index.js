const { toSuggestor } = require('./same')
const hrrule = require('./human-rule').default

const autocomplete = (exp, token = hrrule) => {
  const suggestor = toSuggestor(token)
  const suggestions = suggestor(...exp.split(/\s+/gmu))

  return suggestions.filter(({ suggestion }) => Boolean(suggestion)).map(({ suggestion }) => suggestion)
}

module.exports = {
  default: autocomplete
}
