const { caseOf } = require('./functional')
const { RRule } = require('rrule')

const freqs = {
  year: RRule.YEARLY,
  years: RRule.YEARLY,
  month: RRule.MONTHLY,
  months: RRule.MONTHLY,
  week: RRule.WEEKLY,
  weeks: RRule.WEEKLY,
  day: RRule.DAILY,
  days: RRule.DAILY,
  hour: RRule.HOURLY,
  hours: RRule.HOURLY,
  minute: RRule.MINUTELY,
  minutes: RRule.MINUTELY,
  second: RRule.SECONDLY,
  seconds: RRule.SECONDLY
}

const days = {
  monday: RRule.MO,
  tuesday: RRule.TU,
  wednesday: RRule.WE,
  thursday: RRule.TH,
  friday: RRule.FR,
  saturday: RRule.SA,
  sunday: RRule.SU
}

const months = {
  january: 1,
  february: 2,
  mars: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
}

const isAstEmpty = ast => Array.isArray(ast) && ast.length === 0

const flattenList = arr => arr.reduce(
  (acc, val) => acc.concat(
    caseOf(
      Array.isArray(val),
      [
        [true, () => flattenList(val)],
        [false, () => val]
      ]
    )
  ),
  []
)

const visitFreq = ast => {
  const [intervalAST, freqAST] = ast
  const freq = freqs[freqAST.freq.toLowerCase()]

  const result = { freq, interval: 1 }

  if (!isAstEmpty(intervalAST)) {
    const [token] = intervalAST
    result.interval = parseInt(token.match, 10)
  }

  return result
}

const visitWeekstart = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    const [[wkstAST]] = ast
    result.wkst = days[wkstAST.match.toString().toLowerCase()]
  }

  return result
}

const visitByweekday = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    result.byweekday = flattenList(ast).map(
      day => days[day.match.toString().toLowerCase()]
    )
  }

  return result
}

const visitBymonth = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    result.bymonth = flattenList(ast).map(
      month => months[month.match.toString().toLowerCase()]
    )
  }

  return result
}

const visitBymonthday = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    result.bymonthday = flattenList(ast).map(
      monthday => monthday.match.groups.monthday
    )
  }

  return result
}

const visitByyearday = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    result.byyearday = flattenList(ast).map(
      yearday => yearday.match.groups.yearday
    )
  }

  return result
}

const visitByweekno = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    result.byweekno = flattenList(ast).map(
      weekno => weekno.match.groups.weekno
    )
  }

  return result
}

const visitBytime = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    const times = flattenList(ast).map(
      time => ({
        hour: time.match.groups.hour,
        minute: time.match.groups.minute,
        second: time.match.groups.second
      })
    )

    const defined = val => typeof val !== 'undefined'
    const distinct = arr => [...new Set(arr)]

    result.byhour = distinct(times.map(time => time.hour).filter(defined))
    result.byminute = distinct(times.map(time => time.minute).filter(defined))
    result.bysecond = distinct(times.map(time => time.second).filter(defined))
  }

  return result
}

const visitUntil = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    const [monthAST, monthdayAST, yearAST, [timeAST]] = ast

    const { year } = yearAST.match.groups
    const month = months[monthAST.month]
    const { monthday } = monthdayAST.match.groups

    let dateARGS = [year, month, monthday]

    if (timeAST) {
      dateARGS = dateARGS.concat([
        timeAST.match.groups.hour,
        timeAST.match.groups.minute || 0,
        timeAST.match.groups.second || 0
      ])
    }

    result.until = new Date(Date.UTC(...dateARGS))
  }

  return result
}

const visitCount = ast => {
  const result = {}

  if (!isAstEmpty(ast)) {
    const [countAST] = ast
    result.count = countAST.match.groups.count
  }

  return result
}

const visitRRule = ast => {
  const [
    freqAST,
    weekstartAST,
    byweekdayAST,
    bymonthAST,
    bymonthdayAST,
    byyeardayAST,
    byweeknoAST,
    bytimeAST,
    untilAST,
    countAST
  ] = ast

  return {
    ...visitFreq(freqAST),
    ...visitWeekstart(weekstartAST),
    ...visitByweekday(byweekdayAST),
    ...visitBymonth(bymonthAST),
    ...visitBymonthday(bymonthdayAST),
    ...visitByyearday(byyeardayAST),
    ...visitByweekno(byweeknoAST),
    ...visitBytime(bytimeAST),
    ...visitUntil(untilAST),
    ...visitCount(countAST)
  }
}

module.exports = {
  visitRRule
}
