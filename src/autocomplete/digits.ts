import { SuggestResult, Suggestor } from './token'

import { errorResult, countResult } from './utils'

import same from './same'

export default (maxValue?: number, suffix?: string): Suggestor =>
  (...exps: readonly string[]): readonly SuggestResult[] => {
    const [exp] = exps

    const digitsRegexp = /(?<digits>\d+)(?<expSuffix>.*)/
    const matched = exp.match(digitsRegexp)

    if (matched === null || matched.groups === undefined || !matched.groups.digits) {
      return errorResult(`Digits expected. ${exp} found`)
    }

    const { digits, expSuffix } = matched.groups

    const value = parseInt(digits, 10)

    if (isNaN(value)) {
      return errorResult(`Digits %d${suffix} expected. Found ${exp}`)
    }
    else if (maxValue && value > maxValue) {
      return errorResult(`Too big number found ${value}. Expected lower than ${maxValue}`)
    }

    if (suffix) {
      return same(suffix)(expSuffix)
    }
    else if (expSuffix) {
      return errorResult(`No suffix expected. ${expSuffix} found`)
    }

    return countResult(1)
  }
