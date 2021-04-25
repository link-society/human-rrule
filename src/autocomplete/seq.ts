import Token, {
  Suggestor, SuggestResult
} from './token'

import { findFinished, incCount } from './utils'

import { toSuggestors } from './same'

const seq = (...tokens: readonly Token[]): Suggestor =>
  (...exps: string[]): readonly SuggestResult[] => {
    const suggestors = toSuggestors(...tokens)

    const expsLength = exps.length

    const [suggestor, ...nextSuggestors] = suggestors

    if (suggestor) {
      const suggestorResults = suggestor(...exps)

      const optional = suggestorResults.length === 1 && suggestorResults[0].count === 0 ? suggestorResults[0] : null

      const finished = findFinished(suggestorResults)

      const next = optional || finished

      const count = finished ? finished.count : 0

      if (next) {
        if (nextSuggestors.length > 0) {
          return incCount(
            count,
            seq(...nextSuggestors)(...exps.slice(count))
          )
        }
      }

      return suggestorResults
    }

    return []
  }

export default seq