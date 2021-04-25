import Token, { SuggestResult, Suggestor } from './token'

import { suggestionResult, countResult, errorResult } from './utils'

const same = (name: string): Suggestor => {
  return (...exps: string[]): readonly SuggestResult[] => {
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

export default same

export const toSuggestor = (token: Token): Suggestor => typeof token === 'string' ? same(token) : token

export const toSuggestors = (...tokens: readonly Token[]): readonly Suggestor[] => tokens.map(toSuggestor)