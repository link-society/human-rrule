const { toSuggestors } = require('./same')
const { errorResult } = require('./utils')

const choice = (...tokens) => {
  const suggestors = toSuggestors(...tokens)

  if (suggestors.length < 2) {
    throw new Error(`At least 2 suggestors expected, found ${suggestors.length}`)
  }

  return (...exps) => {
    const suggestResult = suggestors.flatMap(suggestor => suggestor(...exps))
    const suggestions = suggestResult.filter(sr => !sr.error)

    if (suggestions.length === 0) {
      return errorResult('Unexpected token')
    }

    return suggestions
  }
}

module.exports = {
  default: choice
}
