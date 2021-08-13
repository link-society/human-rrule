const {
  makeRule,
  oneOf,
  zeroOrOne,
  zeroOrMore,
  constant,
  constantRegex,
  regex,
  variable,
  rule
} = require('./parser')

const freq = makeRule(
  constant('every'),
  rule(zeroOrOne(makeRule(regex(/[0-9]+/u)))),
  variable('freq')
)

const day = oneOf(
  makeRule(regex(/monday/ui)),
  makeRule(regex(/tuesday/ui)),
  makeRule(regex(/wednesday/ui)),
  makeRule(regex(/thursday/ui)),
  makeRule(regex(/friday/ui)),
  makeRule(regex(/saturday/ui)),
  makeRule(regex(/sunday/ui))
)

const month = oneOf(
  makeRule(regex(/january/ui)),
  makeRule(regex(/february/ui)),
  makeRule(regex(/march/ui)),
  makeRule(regex(/april/ui)),
  makeRule(regex(/may/ui)),
  makeRule(regex(/june/ui)),
  makeRule(regex(/july/ui)),
  makeRule(regex(/august/ui)),
  makeRule(regex(/september/ui)),
  makeRule(regex(/october/ui)),
  makeRule(regex(/november/ui)),
  makeRule(regex(/december/ui))
)

const weekstart = makeRule(
  constant('starting'),
  constant('the'),
  constant('week'),
  constant('on'),
  rule(day)
)

const byweekday = makeRule(
  constant('on'),
  rule(day),
  rule(zeroOrMore(makeRule(
    constantRegex(/,|and/ui),
    rule(day)
  )))
)

const bymonth = makeRule(
  constant('in'),
  rule(month),
  rule(zeroOrMore(makeRule(
    constantRegex(/,|and/ui),
    rule(month)
  )))
)

const bymonthday = makeRule(
  constant('the'),
  regex(/(?<monthday>\d+)(?<ext>st|nd|rd|th)/ui),
  rule(zeroOrMore(makeRule(
    constantRegex(/,|and/ui),
    regex(/(?<monthday>\d+)(?<ext>st|nd|rd|th)/ui)
  )))
)

const byyearday = makeRule(
  constant('on'),
  constant('the'),
  regex(/(?<yearday>\d+)(?<ext>st|nd|rd|th)/ui),
  rule(zeroOrMore(makeRule(
    constantRegex(/,|and/ui),
    regex(/(?<yearday>\d+)(?<ext>st|nd|rd|th)/ui)
  ))),
  constant('day'),
  constant('of'),
  constant('the'),
  constant('year')
)

const byweekno = makeRule(
  constant('on'),
  constant('the'),
  regex(/(?<weekno>\d+)(?<ext>st|nd|rd|th)/ui),
  rule(zeroOrMore(makeRule(
    constantRegex(/,|and/ui),
    regex(/(?<weekno>\d+)(?<ext>st|nd|rd|th)/ui)
  ))),
  constant('week'),
  constant('of'),
  constant('the'),
  constant('year')
)

const bytime = makeRule(
  constant('at'),
  regex(/(?:(?<hour>\d\d?)h)?(?:(?<minute>\d\d?)m)?(?:(?<second>\d\d?)s)?/ui),
  rule(zeroOrMore(makeRule(
    constantRegex(/,|and/ui),
    regex(/(?:(?<hour>\d\d?)h)?(?:(?<minute>\d\d?)m)?(?:(?<second>\d\d?)s)?/ui)
  )))
)

const until = makeRule(
  constant('until'),
  variable('month'),
  regex(/(?<monthday>\d+)/ui),
  constant(','),
  regex(/(?<year>\d+)/ui),
  rule(zeroOrOne(makeRule(
    constant('at'),
    regex(/(?:(?<hour>\d\d?)h)?(?:(?<minute>\d\d?)m)?(?:(?<second>\d\d?)s)?/ui)
  )))
)

const count = makeRule(
  constant('for'),
  regex(/(?<count>\d+)/ui),
  constantRegex(/times?/ui)
)

const rrule = makeRule(
  rule(freq),
  rule(zeroOrOne(weekstart)),
  rule(zeroOrOne(byweekday)),
  rule(zeroOrOne(bymonth)),
  rule(zeroOrOne(bymonthday)),
  rule(zeroOrOne(byyearday)),
  rule(zeroOrOne(byweekno)),
  rule(zeroOrOne(bytime)),
  rule(zeroOrOne(until)),
  rule(zeroOrOne(count))
)

module.exports = { rrule }
