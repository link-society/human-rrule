const suggestionResult = (suggestion, count = 1) => [{
  suggestion,
  count
}]
const errorResult = (error, count = 1) => [{
  suggestion: '',
  error,
  count
}]
const countResult = (count = 1) => [{
  suggestion: '',
  count
}]

const findFinished = suggestors =>
  suggestors.find(({ suggestion, error }) => !(suggestion || error))

const incCount = (count, suggestResults) => suggestResults.map(
  suggestResult => ({ ...suggestResult, count: suggestResult.count + count })
)

module.exports = {
  suggestionResult,
  errorResult,
  countResult,
  findFinished,
  incCount
}
