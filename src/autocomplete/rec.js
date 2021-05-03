const { findFinished, incCount } = require('./utils')

const { toSuggestors } = require('./same')

const seq = require('./seq').default

const rec = (...tokens) =>
  (...exps) => {
    const suggestors = toSuggestors(...tokens)

    let result = seq(...suggestors)(...exps)

    let finished = findFinished(result)

    if (finished) {
      let { count } = finished

      while (finished) {
        const nextResults = seq(...suggestors)(...exps.slice(count))
        finished = findFinished(nextResults)

        if (finished) {
          count += finished.count
          const finalCount = count
          result = nextResults.map(
            suggestResult => ({ ...suggestResult, count: suggestResult.count + finalCount })
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

module.exports = {
  default: rec
}
