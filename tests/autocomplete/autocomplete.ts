import { describe, it } from 'mocha'
import assert from 'assert'
import plural from '../../src/autocomplete/plural'
import seq from '../../src/autocomplete/seq'
import opt from '../../src/autocomplete/opt'
import autocomplete from '../../src/autocomplete'

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
