const makePrefixes = regex => {
  if (regex.length === 0) {
    throw new Error('empty regex')
  }
  else if (regex.length === 1) {
    return regex
  }
  const prefix = regex.charAt(0) === ' ' ? '\\s+' : regex.charAt(0)
  return `${prefix}(?:${makePrefixes(regex.slice(1))})?`
}

const regexPrefixes = regex => new RegExp(makePrefixes(regex), 'iu')

const getSuggestions = (exp, suggestions) => {
  const digitsMatch = exp.match(/\d+/u)
  const digits = digitsMatch ? digitsMatch[0] : ''
  const rePrefixes = suggestions.map(regexPrefixes)
  return suggestions.filter(
    (_suggestion, index) => exp.match(rePrefixes[index])
  ).map(
    (_suggestion, index) => exp.replace('\\d+', digits).replace(rePrefixes[index])
  )
}

const freq = 'every\\s+\\d+?'
const freqs = ['every ']

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]
const day = days.join('|')

const months = [
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
]
const month = months.join('|')

const weekStart = `starting +the +week +on +${day}`
const weekStarts = days.map(
  dayValue => `starting the week on ${dayValue}`
)

const and = ',|and +'
const ands = [', ', ' and ']

const byWeekDay = `on +${day} +(${and} +${day})*`
const byWeekDays = days.flatMap(
  dayValue => [`on ${dayValue}`, ...ands.flatMap(
    andValue => [`on ${dayValue}${andValue}`, ...days.map(
      subDayValue => `on ${dayValue}${andValue} ${subDayValue}`
    )]
  )]
)

const byMonth = `in +${month} +(${and} +${month})*`
const byMonths = months.flatMap(
  monthValue => [`in ${monthValue}`, ...ands.flatMap(
    andValue => [`in ${monthValue}${andValue}`, ...months.map(
      subMonthValue => `in ${monthValue}${andValue} ${subMonthValue}`
    )]
  )]
)

const ext = 'st|nd|rd|th'
const exts = ext.split('|')

const monthDay = `\\d+ +${ext}`
const monthDays = exts.map(
  extValue => `\\d+ ${extValue}`
)

const byMonthDay = `the ${monthDay} (${and} +${monthDay})*`
const byMonthDays = monthDays.flatMap(
  monthDayValue => [`in ${monthDayValue}`, ...ands.flatMap(
    andValue => [`in ${monthDayValue}${andValue}`, ...monthDays.map(
      subMonthDayValue => `in ${monthDayValue}${andValue} ${subMonthDayValue}`
    )]
  )]
)

const yearDay = `\\d+ +${ext}`
const yearDays = exts.map(
  extValue => `\\d+ ${extValue}`
)

const byYearDay = `on +the +${yearDay} +${ext} +(${and} +${yearDay} +${ext})* +day +of +the +year`
const byYearDays = yearDays.flatMap(
  yearDayValue => [`on the ${yearDayValue}`, ...exts.flatMap(
    extValue => [`on the ${yearDayValue} ${extValue}`, ...ands.flatMap(
      andValue => [`on the ${yearDayValue} ${extValue}${andValue}`, ...yearDays.map(
        subYearDayValue => `on the ${yearDayValue} ${extValue}${andValue} ${subYearDayValue}`
      )]
    )]
  )]
)

const weekNo = '\\d+'

const byWeekNo = `on +the +${weekNo} +${ext} +(${and} +${weekNo} +${ext})* +week +of +the +year`
const byWeekNos = exts.flatMap(
  extValue => [`on the ${weekNo} ${extValue} week of the year`, ...ands.flatMap(
    andValue => [`on the ${weekNo} ${extValue}${andValue}`, ...yearDays.map(
      yearDayValue => `on the ${weekNo} ${extValue}${andValue} ${yearDayValue} ${extValue} week of the year`
    )]
  )]
)

const hour = '[0-3]?\\dh'
const minute = '[0-5]\\dm'
const second = '[0-5]\\ds'
const time = `(${hour})?(${minute})?(${second})?`
const times = [
  '\\d+h',
  '\\d+h\\d+m',
  '\\d+h\\d+m\\d+s',
  '\\d+m',
  '\\d+m\\d+s',
  '\\d+s'
]

const byTime = `at +${time} +(${and} +${time})*`
const byTimes = times.flatMap(
  timeValue => [`at ${timeValue}`, ...ands.flatMap(
    andValue => times.flatMap(
      subTimeValue => [`at ${timeValue}${andValue} ${subTimeValue}`]
    )
  )]
)

const until = `until +month +\\d+ +, +\\d{4} +(at +${time})?`
const untils = [
  'until month \\d+, \\d+',
  ...times.flatMap(
    timeValue => `until month \\d+, \\d+ at ${timeValue}`
  )
]

const count = 'for +\\d+ +times?'
const counts = ['for \\d+ time', 'for \\d+ times']

const re = new RegExp(`^\\s*(?<freq>${freq})?(\\s+(?<weekStart>${weekStart}))?(\\s+(?<byWeekDay>${byWeekDay}))?(\\s+(?<byMonth>${byMonth}))?(\\s+(?<byMonthDay>${byMonthDay}))?(\\s+(?<byYearDay>${byYearDay}))?(\\s+(?<byWeekNo>${byWeekNo}))?(\\s+(?<byTime>${byTime}))?(\\s+(?<until>${until}))?(\\s+(?<count>${count}))?\\s*$`, 'imu')

const prefixes = {
  freq: freqs,
  weekStart: weekStarts,
  byWeekDay: byWeekDays,
  byMonth: byMonths,
  byMonthDay: byMonthDays,
  byYearDay: byYearDays,
  byWeekNo: byWeekNos,
  byTime: byTimes,
  until: untils,
  count: counts
}

const autocomplete = exp => {
  const match = exp.match(re)
  if (match) {
    const { groups } = match
    return Object.entries(prefixes)
      .filter(
        ([groupName]) => !groups[groupName]
      )
      .flatMap(
        ([, suggestions]) => getSuggestions(exp, suggestions)
      )
  }
  return []
}

module.exports = {
  autocomplete,
  makePrefixes,
  getSuggestions
}
