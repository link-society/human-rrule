const { describe, it } = require('mocha')
const assert = require('assert')
const { makePrefixes, getSuggestions, autocomplete } = require('../src/autocomplete')

describe('makePrefixes', () => {
  it('should throw an error on empty param', () => {
    assert.throws(() => makePrefixes())
  })

  it('should throw an error on empty string', () => {
    assert.throws(() => makePrefixes(''))
  })

  it('should process simple word', () => {
    assert.strictEqual(makePrefixes('azer'), 'a(?:z(?:e(?:r)?)?)?')
  })

  it('should process spaces word', () => {
    assert.strictEqual(makePrefixes('az er'), 'a(?:z(?:\\s+(?:e(?:r)?)?)?)?')
  })
})

describe('getSuggestions', () => {
  it('should throw an error on empty param', () => {
    assert.throws(() => getSuggestions())
  })
})