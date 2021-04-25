import { describe, it } from 'mocha'
import assert from 'assert'
import plural from '../../src/autocomplete/plural'
import digits from '../../src/autocomplete/digits'
import seq from '../../src/autocomplete/seq'
import opt from '../../src/autocomplete/opt'

describe('seq', () => {
  it('should do nothing without suggestors', () => {
    assert.deepStrictEqual([], seq()())
  })

  it('should delegate suggestion from first word', () => {
    const sq = seq('test')

    assert.deepStrictEqual([{
      suggestion: 'test',
      count: 1
    }], sq(''))
    assert.deepStrictEqual([{
      suggestion: 'est',
      count: 1
    }], sq('t'))
    assert.deepStrictEqual([{
      suggestion: '',
      error: 'q wrong token. Expected test',
      count: 1
    }], sq('q'))
  })

  it('should delegate suggestion from first word with words', () => {
    const sq = seq('quick', 'test')

    assert.deepStrictEqual([{
      suggestion: 'quick',
      count: 1
    }], sq(''))
    assert.deepStrictEqual([{
      suggestion: 'uick',
      count: 1
    }], sq('q'))
    assert.deepStrictEqual([{
      suggestion: '',
      error: 't wrong token. Expected quick',
      count: 1
    }], sq('t'))
  })

  it('should delegate suggestion from second word with words', () => {
    const sq = seq('quick', 'test')

    assert.deepStrictEqual([{
      suggestion: 'test',
      count: 2
    }], sq('quick', ''))
    assert.deepStrictEqual([{
      suggestion: 'est',
      count: 2
    }], sq('quick', 't'))
    assert.deepStrictEqual([{
      suggestion: '',
      error: 'q wrong token. Expected test',
      count: 2
    }], sq('quick', 'q'))
  })

  it('should delegate to composite token', () => {
    const sq = seq(digits(60, 't'), plural('test'))

    assert.deepStrictEqual([{
      suggestion: 't',
      count: 1
    }], sq('22', ''))
    assert.deepStrictEqual([{
      suggestion: 'test',
      count: 2
    }, {
      suggestion: 'tests',
      count: 2
    }], sq('22t', ''))
    assert.deepStrictEqual([{
      suggestion: '',
      count: 2
    }, {
      suggestion: 's',
      count: 2
    }], sq('22t', 'test'))
    assert.deepStrictEqual([{
      suggestion: '',
      error: 'Unexpected token',
      count: 2
    }], sq('22t', 'q'))
  })

  it('should delegate suggestion to seq of seq', () => {
    const sq = seq('the', seq('ultimate', plural('test')), 'story')

    assert.deepStrictEqual([{
      suggestion: 'ultimate',
      count: 2
    }], sq('the', ''))
    assert.deepStrictEqual([{
      suggestion: 'ltimate',
      count: 2
    }], sq('the', 'u'))
    assert.deepStrictEqual([{
      suggestion: 'test',
      count: 3
    }, {
      suggestion: 'tests',
      count: 3
    }], sq('the', 'ultimate', ''))
    assert.deepStrictEqual([{
      suggestion: 'tory',
      count: 4
    }], sq('the', 'ultimate', 'test', 's'))
  })

  it('should suggest tokens after opt', () => {
    const sq = seq('the', 'final', opt('quick'), plural('test'))
    assert.deepStrictEqual([{
      suggestion: 'st',
      count: 3
    }, {
      suggestion: 'sts',
      count: 3
    }], sq('the', 'final', 'te'))
  })
})
