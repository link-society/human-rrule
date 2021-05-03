const choice = require('./choice').default
const seq = require('./seq').default
const same = require('./same').default
const opt = require('./opt').default
const digits = require('./digits').default
const rec = require('./rec').default
const plural = require('./plural').default

const durations = choice(...[
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year'
].map(plural))

const count = seq(
  same('for'),
  digits(),
  plural('time')
)

const time = seq(
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

const until = seq(
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

const and = choice(same(','), same('and'))

const byTime = seq(
  same('at'),
  time,
  opt(
    rec(
      and,
      time
    )
  )
)

const ext = choice(
  same('st'),
  same('nd'),
  same('rd'),
  same('th')
)

const weekNo = seq(
  digits(),
  ext
)

const byWeekNo = seq(
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

const yearDay = seq(
  digits(),
  ext
)

const ByYearDay = seq(
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

const monthDay = seq(
  digits(),
  ext
)

const byMonthDay = seq(
  same('the'),
  monthDay,
  opt(
    rec(
      and,
      monthDay
    )
  )
)

const month = choice(...[
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

const byMonth = seq(
  same('in'),
  month,
  opt(
    rec(
      and,
      month
    )
  )
)

const day = choice(...[
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
].map(same))

const byWeekDay = seq(
  same('on'),
  day,
  opt(
    rec(
      and,
      day
    )
  )
)

const weekStart = seq(
  same('starting'),
  same('the'),
  same('week'),
  same('on'),
  day
)

const freq = seq(
  same('every'),
  opt(digits()),
  durations
)

const hrrule = seq(
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


module.exports = {
  durations,
  count,
  time,
  until,
  and,
  byTime,
  ext,
  weekNo,
  byWeekNo,
  yearDay,
  ByYearDay,
  monthDay,
  byMonthDay,
  month,
  byMonth,
  day,
  byWeekDay,
  weekStart,
  freq,
  default: hrrule
}
