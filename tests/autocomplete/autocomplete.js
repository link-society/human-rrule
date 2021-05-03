const { describe, it } = require('mocha')
const assert = require('assert')
const plural = require('../../src/autocomplete/plural').default
const seq = require('../../src/autocomplete/seq').default
const opt = require('../../src/autocomplete/opt').default
const autocomplete = require('../../src/autocomplete').default

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
