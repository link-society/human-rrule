import pluralize from 'pluralize'

type SuggestResult = {
  readonly suggestion: string;
  readonly count: number;
  readonly error?: string;
}


type Suggestor = {
  (...exps: readonly string[]): readonly SuggestResult[];
}

type Token = string|Suggestor

const suggestionResult = (suggestion: string, count: number = 1) => [{
  suggestion,
  count
}]
const errorResult = (error: string, count: number = 1) => [{
  suggestion: '',
  error,
  count
}]
const countResult = (count: number = 1) => [{
  suggestion: '',
  count
}]

const findFinished = (suggestors: readonly SuggestResult[]) =>
  suggestors.find(({ suggestion, error }) => !(suggestion || error))

const incCount = (count: number, suggestResults: readonly SuggestResult[]) => suggestResults.map(
  suggestResult => ({ ...suggestResult, count: suggestResult.count + count })
)

export const same = (name: string): Suggestor => {
  if (!name) {
    throw new Error('Missing token')
  }

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

export const toSuggestor = (token: Token) => typeof token === 'string' ? same(token) : token

export const toSuggestors = (...tokens: readonly Token[]) => tokens.map(toSuggestor)

export const choice = (...tokens: readonly Token[]): Suggestor => {
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

export const plural = (name: string): Suggestor =>
  choice(name, pluralize(name))

export const digits = (maxValue?: number, suffix?: string): Suggestor =>
  (...exps: readonly string[]): readonly SuggestResult[] => {
    const [exp] = exps

    const digitsRegexp = /(?<digits>\d+)(?<expSuffix>.*)/
    const matched = exp.match(digitsRegexp)

    if (matched === null || matched.groups === undefined || !matched.groups.digits) {
      return errorResult(`Digits expected. ${exp} found`)
    }

    const { digits, expSuffix } = matched.groups

    if (digits) {
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

    return errorResult(`Digits %d${suffix} expected. Found ${exp}`)
  }

export const seq = (...tokens: readonly Token[]): Suggestor =>
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

export const rec = (...tokens: readonly Token[]): Suggestor =>
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

export const opt = (token: Token): Suggestor =>
  (...exps: readonly string[]): readonly SuggestResult[] => {
    const suggestor = toSuggestor(token)
    const results = suggestor(...exps)

    const result = results.filter(({ error }) => !error)

    return result.length > 0 ? result : errorResult('Optional not met', 0)
  }

export const durations = choice(...[
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year'
].map(plural))

export const count = seq(
  same('for'),
  digits(),
  plural('time')
)

export const time = seq(
  opt(
    digits(2, 'h')
  ),
  opt(
    digits(2, 'm')
  ),
  opt(
    digits(2, 's')
  )
)

export const until = seq(
  same('until'),
  same('month'),
  digits(0, ','),
  digits(4),
  opt(
    rec(
      same('at'),
      time
    )
  )
)

export const and = choice(same(','), same('and'))

export const byTime = seq(
  same('at'),
  time,
  opt(
    rec(
      and,
      time
    )
  )
)

export const ext = choice(
  same('st'),
  same('nd'),
  same('rd'),
  same('th')
)

export const weekNo = seq(
  digits(),
  ext
)

export const byWeekNo = seq(
  same('on'),
  same('the'),
  weekNo,
  opt(
    rec(
      and,
      weekNo
    )
  )
)

export const yearDay = seq(
  digits(),
  ext
)

export const ByYearDay = seq(
  same('on'),
  same('the'),
  yearDay,
  opt(
    rec(
      and,
      yearDay
    )
  )
)

export const monthDay = seq(
  digits(),
  ext
)

export const byMonthDay = seq(
  same('the'),
  monthDay,
  opt(
    rec(
      and,
      monthDay
    )
  )
)

export const month = choice(...[
  'january',
  'february',
  'mars',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
].map(same))

export const byMonth = seq(
  same('in'),
  month,
  opt(
    rec(
      and,
      month
    )
  )
)

export const day = choice(...[
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
].map(same))

export const byWeekDay = seq(
  same('on'),
  day,
  opt(
    rec(
      and,
      day
    )
  )
)

export const weekStart = seq(
  same('starting'),
  same('the'),
  same('week'),
  same('on'),
  day
)

export const freq = seq(
  same('every'),
  opt(digits()),
  durations
)

export const defaultSuggestor = seq(
  freq,
  opt(weekStart),
  opt(byWeekDay),
  opt(byMonth),
  opt(byMonthDay),
  opt(ByYearDay),
  opt(byWeekNo),
  opt(byTime),
  opt(until),
  opt(count)
)

export const autocomplete =
  (exp: string, token: Token = defaultSuggestor): readonly string[] => {
    const suggestor = toSuggestor(token)
    const suggestions = suggestor(...exp.split(/\s+/gm))
    return suggestions.filter(({ suggestion }) => !!suggestion).map(({ suggestion }) => suggestion)
  }
