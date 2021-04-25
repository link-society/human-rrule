import Token from './token'
import { toSuggestor } from './same'
import rule from './human-rule'

export default (exp: string, token: Token = rule): readonly string[] => {
  const suggestor = toSuggestor(token)
  const suggestions = suggestor(...exp.split(/\s+/gm))
  return suggestions.filter(({ suggestion }) => !!suggestion).map(({ suggestion }) => suggestion)
}
