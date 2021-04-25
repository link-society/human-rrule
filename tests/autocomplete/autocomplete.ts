import { describe, it } from 'mocha'
import assert from 'assert'
const { plural, seq, opt, autocomplete } = require('../../dist/autocomplete')

describe('autocomplete', () => {
  it('should raise an error without params', () => {
    assert.throws(() => autocomplete())
  })

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
