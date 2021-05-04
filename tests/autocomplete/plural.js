const { describe, it } = require('mocha')
const assert = require('assert')
const plural = require('../../src/autocomplete/plural').default

describe('plural', () => {
  it('should suggest both singular and plural forms', () => {
    const pl = plural('test')
    assert.deepStrictEqual([{
      suggestion: 'est',
      count: 1
    }, {
      suggestion: 'ests',
      count: 1
    }], pl('t'))
  })

  it('should only suggest plural form when matching with singular expression', () => {
    const pl = plural('test')
    assert.deepStrictEqual([{
      suggestion: '',
      count: 1
    }, {
      suggestion: 's',
      count: 1
    }], pl('test'))
  })

  it('should not suggest anything if expression match plural form', () => {
    const pl = plural('story')
    assert.deepStrictEqual([{
      suggestion: 's',
      count: 1
    }], pl('storie'))
  })
})
