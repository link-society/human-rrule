import choice from './choice'
import seq from './seq'
import same from './same'
import opt from './opt'
import digits from './digits'
import rec from './rec'
import plural from './plural'

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

export default seq(
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
