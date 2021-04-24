const { describe, it } = require('mocha')
const assert = require('assert')
const { same, choice, plural, digits, seq, rec, opt, autocomplete } = require('../dist/autocomplete')

describe('same', () => {
  it('should raise an error without params', () => {
    assert.throws(() => same())
  })

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

describe('choice', () => {
  it('should raise an error without params', () => {
    assert.throws(() => choice())
  })

  it('should raise an error with one param', () => {
    assert.throws(() => choice('test'))
  })

  it('should suggest all matching tokens', () => {
    const cc = choice('azert', 'testy', 'testo')
    assert.deepStrictEqual([{
      suggestion: 'esty',
      count: 1
    }, {
      suggestion: 'esto',
      count: 1
    }], cc('t'))
  })

  it('should not suggest without matching tokens', () => {
    const cc = choice('azert', 'testy', 'testo')
    assert.deepStrictEqual([{
      error: 'Unexpected token',
      count: 1,
      suggestion: ''
    }], cc('q'))
  })
})

describe('plural', () => {
  it('should raise an error without params', () => {
    assert.throws(() => plural())
  })

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

describe('opt', () => {
  it('should raise an error without params', () => {
    assert.throws(() => opt()())
  })

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
