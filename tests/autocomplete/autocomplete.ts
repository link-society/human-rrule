import { describe, it } from 'mocha'
import assert from 'assert'
import { plural, seq, opt, autocomplete } from '../../src/autocomplete'

describe('autocomplete', () => {
  it('should suggest only suggestions', () => {
    assert.deepStrictEqual(
      ['st', 'sts'],
      autocomplete(
        'the final te',
        seq('the', 'final', opt('quick'), plural('test'))
      )
    )
  })
})
