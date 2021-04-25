import Token, {
  Suggestor, SuggestResult
} from './token'

import { toSuggestor } from './same'

import { errorResult } from './utils'

export default (token: Token): Suggestor =>
  (...exps: readonly string[]): readonly SuggestResult[] => {
    const suggestor = toSuggestor(token)
    const results = suggestor(...exps)

    const result = results.filter(({ error }) => !error)

    return result.length > 0 ? result : errorResult('Optional not met', 0)
  }
