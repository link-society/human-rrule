const { describe, it } = require('mocha')
const assert = require('assert')

describe('human-rrule', () => {
  const { RRule } = require('rrule')
  const { parseHumanRRule } = require('../src/index.js')

  it('should parse a simple rrule', () => {
    const result = parseHumanRRule('every 5 minutes')

    assert.equal(result.freq, RRule.MINUTELY)
    assert.equal(result.interval, 5)
  })

  it('should fail nicely', () => {
    assert.throws(
      () => parseHumanRRule('not every 5 minutes'),
      Error,
      'Could not parse: not every 5 minutes'
    )
  })

  it('should parse weekstart', () => {
    const result = parseHumanRRule('every day starting the week on Sunday')

    assert.equal(result.freq, RRule.DAILY)
    assert.equal(result.interval, 1)
    assert.equal(result.wkst, RRule.SU)
  })

  it('should parse byweekday', () => {
    const result = parseHumanRRule('every week on Monday, Friday and Sunday')

    assert.equal(result.freq, RRule.WEEKLY)
    assert.equal(result.interval, 1)
    assert.deepEqual(result.byweekday, [RRule.MO, RRule.FR, RRule.SU])
  })

  it('should parse bymonth', () => {
    const result = parseHumanRRule('every day in january')

    assert.equal(result.freq, RRule.DAILY)
    assert.equal(result.interval, 1)
    assert.deepEqual(result.bymonth, [1])
  })

  it('should parse bymonthday', () => {
    const result = parseHumanRRule('every hour in january the 1st, 2nd, 3rd and 4th')

    assert.equal(result.freq, RRule.HOURLY)
    assert.equal(result.interval, 1)
    assert.deepEqual(result.bymonth, [1])
    assert.deepEqual(result.bymonthday, [1, 2, 3, 4])
  })

  it('should parse byyearday', () => {
    const result = parseHumanRRule('every hour on the 42th and 43th day of the year')

    assert.equal(result.freq, RRule.HOURLY)
    assert.equal(result.interval, 1)
    assert.deepEqual(result.byyearday, [42, 43])
  })

  it('should parse byweekno', () => {
    const result = parseHumanRRule('every day on the 2nd and 3rd week of the year')

    assert.equal(result.freq, RRule.DAILY)
    assert.equal(result.interval, 1)
    assert.deepEqual(result.byweekno, [2, 3])
  })

  it('should parse byhour', () => {
    const result = parseHumanRRule('every day at 18h, 18h30m, 18h30m50s')

    assert.equal(result.freq, RRule.DAILY)
    assert.equal(result.interval, 1)
    assert.deepEqual(result.byhour, [18])
    assert.deepEqual(result.byminute, [30])
    assert.deepEqual(result.bysecond, [50])
  })

  it('should parse byminute', () => {
    const result = parseHumanRRule('every 2 hours at 5m')

    assert.equal(result.freq, RRule.HOURLY)
    assert.equal(result.interval, 2)
    assert.deepEqual(result.byminute, [5])
  })

  it('should parse bysecond', () => {
    const result = parseHumanRRule('every 10 minutes at 15s')

    assert.equal(result.freq, RRule.MINUTELY)
    assert.equal(result.interval, 10)
    assert.deepEqual(result.bysecond, [15])
  })

  it('should parse until', () => {
    const result = parseHumanRRule('every day at 18h until February 3, 2020 at 18h30m50s')

    assert.equal(result.freq, RRule.DAILY)
    assert.equal(result.interval, 1)
    assert.deepEqual(result.byhour, [18])
    assert.equal(result.until.getTime(), Date.UTC(2020, 2, 3, 18, 30, 50))
  })

  it('should parse count', () => {
    const result = parseHumanRRule('every day for 30 times')

    assert.equal(result.freq, RRule.DAILY)
    assert.equal(result.interval, 1)
    assert.equal(result.count, 30)
  })
})
