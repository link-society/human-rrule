import Token, {
  Suggestor, SuggestResult
} from './token'

import { findFinished, incCount } from './utils'

import { toSuggestors } from './same'

import seq from './seq'

export default (...tokens: readonly Token[]): Suggestor =>
  (...exps: readonly string[]): readonly SuggestResult[] => {
    const suggestors = toSuggestors(...tokens)

    let result = seq(...suggestors)(...exps)

    const finished = findFinished(result)

    if (finished) {
      let { count } = finished

      while (finished) {
        const nextResults = seq(...suggestors)(...exps.slice(count))
        const nextFinished = findFinished(nextResults)

        if (nextFinished) {
          count += nextFinished.count
          result = nextResults.map(
            suggestResult => ({ ...suggestResult, count: suggestResult.count + count })
          )
        }
        else {
          result = incCount(count, nextResults)
          break
        }
      }
    }

    return result
  }
