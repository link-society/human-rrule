const { suggestionResult, countResult, errorResult } = require('./utils')

const same = name => {
  return (...exps) => {
    const [exp] = exps

    if (name.startsWith(exp)) {
      const remainder = name.substring(exp.length)

      if (remainder) {
        return suggestionResult(remainder, 1)
      }

      return countResult()
    }

    return errorResult(`${exp} wrong token. Expected ${name}`)
  }
}

const toSuggestor = token => {
  return typeof token === 'string' ? same(token) : token
}

const toSuggestors = (...tokens) => tokens.map(toSuggestor)

module.exports = {
  default: same,
  toSuggestor,
  toSuggestors
}
