const { describe, it } = require('mocha')
const assert = require('assert')
const digits = require('../../src/autocomplete/digits').default

describe('digits', () => {
  it('should return an error without digits', () => {
    const dg = digits(2)
    assert.deepStrictEqual([{
      suggestion: '',
      count: 1,
      error: 'Digits expected. test found'
    }], dg('test'))
  })

  it('should return an error with too high number', () => {
    const dg = digits(2)
    assert.deepStrictEqual([{
      suggestion: '',
      count: 1,
      error: 'Too big number found 4. Expected lower than 2'
    }], dg('4'))
  })

  it('should not return suggestions with simple digits', () => {
    const dg = digits()
    assert.deepStrictEqual([{
      suggestion: '',
      count: 1
    }], dg('22'))
  })

  it('should return suffix suggestion', () => {
    const dg = digits(2, 'm')
    assert.deepStrictEqual([{
      suggestion: 'm',
      count: 1
    }], dg('2'))
  })

  it('should return an error when a suffix is given but not expected', () => {
    const dg = digits()
    assert.deepStrictEqual([{
      suggestion: '',
      count: 1,
      error: 'No suffix expected. m found'
    }], dg('2m'))
  })
})
