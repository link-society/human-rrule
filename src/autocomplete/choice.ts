import Token, {
  Suggestor, SuggestResult
} from './token'

import { toSuggestors } from './same'
import { errorResult } from './utils'

export default (...tokens: readonly Token[]): Suggestor => {
  const suggestors = toSuggestors(...tokens)

  if (suggestors.length < 2) {
    throw new Error(`At least 2 suggestors expected, found ${suggestors.length}`)
  }

  return (...exps: readonly string[]): readonly SuggestResult[] => {
    const suggestResult: readonly SuggestResult[] = suggestors.flatMap(suggestor => suggestor(...exps))
    const suggestions: readonly SuggestResult[] = suggestResult.filter(sr => !sr.error)

    if (suggestions.length === 0) {
      return errorResult('Unexpected token')
    }

    return suggestions
  }
}
