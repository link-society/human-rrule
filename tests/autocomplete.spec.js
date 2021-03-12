const { describe, it } = require('mocha')
const assert = require('assert')
const { makePrefixes, getSuggestions, autocomplete } = require('../src/autocomplete')

describe('makePrefixes', () => {
  it('should error on empty param', () => {
    assert.throws(() => makePrefixes())
  })

  it('should convert empty string', () => {
    assert.strictEqual(makePrefixes(''), '')
  })

  it('should process simple word', () => {
    assert.strictEqual(makePrefixes('azer'), 'a(?:z(?:e(?:r)?)?)?')
  })

  it('should process spaces word', () => {
    assert.strictEqual(makePrefixes('az er'), 'a(?:z(?:\\s+(?:e(?:r)?)?)?)?')
  })
})
