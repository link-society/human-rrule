const { errorResult, countResult } = require('./utils')

const same = require('./same').default

const digits = (maxValue, suffix) =>
  (...exps) => {
    const [exp] = exps

    const digitsRegexp = /(?<expDigits>\d+)(?<expSuffix>.*)/u
    const matched = exp.match(digitsRegexp)

    if (matched === null || matched.groups === null || !matched.groups.expDigits) {
      return errorResult(`Digits expected. ${exp} found`)
    }

    const { expDigits, expSuffix } = matched.groups

    const value = parseInt(expDigits, 10)

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

module.exports = {
  default: digits
}
