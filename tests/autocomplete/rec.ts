import { describe, it } from 'mocha'
import assert from 'assert'
import rec from '../../src/autocomplete/rec'

describe('rec', () => {
  it('should not suggest anything without params', () => {
    const rc = rec()
    assert.deepStrictEqual([], rc())
  })

  it('should suggest recursive term', () => {
    const rc = rec('the', 'final', 'test')
    assert.deepStrictEqual([{
      suggestion: 'inal',
      count: 5
    }], rc('the', 'final', 'test', 'the', 'f'))
  })

  it('should suggest recursive term', () => {
    const rc = rec('the', 'final', 'test')
    assert.deepStrictEqual([{
      suggestion: 'inal',
      count: 2
    }], rc('the', 'f'))
  })
})
