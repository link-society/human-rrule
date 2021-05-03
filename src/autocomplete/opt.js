const { toSuggestor } = require('./same')

const { errorResult } = require('./utils')

const opt = token =>
  (...exps) => {
    const suggestor = toSuggestor(token)
    const results = suggestor(...exps)

    const result = results.filter(({ error }) => !error)

    return result.length > 0 ? result : errorResult('Optional not met', 0)
  }

module.exports = {
  default: opt
}
