const { describe, it } = require('mocha')
const assert = require('assert')
const choice = require('../../src/autocomplete/choice').default

describe('choice', () => {
  it('should raise an error without params', () => {
    assert.throws(() => choice())
  })

  it('should raise an error with one param', () => {
    assert.throws(() => choice('test'))
  })

  it('should suggest all matching tokens', () => {
    const cc = choice('azert', 'testy', 'testo')
    assert.deepStrictEqual([{
      suggestion: 'esty',
      count: 1
    }, {
      suggestion: 'esto',
      count: 1
    }], cc('t'))
  })

  it('should not suggest without matching tokens', () => {
    const cc = choice('azert', 'testy', 'testo')
    assert.deepStrictEqual([{
      error: 'Unexpected token',
      count: 1,
      suggestion: ''
    }], cc('q'))
  })
})
