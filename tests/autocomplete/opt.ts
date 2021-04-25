import { describe, it } from 'mocha'
import assert from 'assert'
import opt from '../../src/autocomplete/opt'

describe('opt', () => {
  it('should not suggest errored token', () => {
    const ot = opt('optional')
    assert.deepStrictEqual([{
      error: 'Optional not met',
      count: 0,
      suggestion: ''
    }], ot('wrong'))
  })

  it('should suggest right token', () => {
    const ot = opt('optional')
    assert.deepStrictEqual([{
      suggestion: 'ional',
      count: 1
    }], ot('opt'))
  })
})
