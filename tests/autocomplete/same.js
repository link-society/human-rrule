const { describe, it } = require('mocha')
const assert = require('assert')
const same = require('../../src/autocomplete/same').default

describe('same', () => {
  it('should suggest entire same with empty expression', () => {
    assert.deepStrictEqual([{ suggestion: 'test', count: 1 }], same('test')(''))
  })

  it('should suggest remainder entire same with empty expression', () => {
    assert.deepStrictEqual([{ suggestion: 'est', count: 1 }], same('test')('t'))
  })

  it('should not suggest anything when same match entirely the expression', () => {
    assert.deepStrictEqual([{ suggestion: '', count: 1 }], same('test')('test'))
  })

  it('should not suggest anything when same does not start with the expression', () => {
    assert.deepStrictEqual([{ suggestion: '', count: 1, error: 'wrong wrong token. Expected test' }], same('test')('wrong'))
  })
})
