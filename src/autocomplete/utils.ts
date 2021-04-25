import Token, { SuggestResult, Suggestor } from './token'

export const suggestionResult = (suggestion: string, count: number = 1) => [{
  suggestion,
  count
}]
export const errorResult = (error: string, count: number = 1) => [{
  suggestion: '',
  error,
  count
}]
export const countResult = (count: number = 1) => [{
  suggestion: '',
  count
}]

export const findFinished = (suggestors: readonly SuggestResult[]) =>
  suggestors.find(({ suggestion, error }) => !(suggestion || error))

export const incCount = (count: number, suggestResults: readonly SuggestResult[]) => suggestResults.map(
  suggestResult => ({ ...suggestResult, count: suggestResult.count + count })
)
