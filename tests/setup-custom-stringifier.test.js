import React from 'react'
import {expect} from 'chai'
import {setup} from '../src'

/**
 * The idea behind this is one could insert a custom stringifier like `flatted` for handling circular references.
 */
describe('setup custom stringifier', () => {
  it('should match snapshots with a custom stringify function', () => {
    let spy = null
    setup({
      stringifyFunction: (value, replacer, space) => {
        value.a = 'whatever'
        spy = value
        return JSON.stringify(value, replacer, space)
      }
    })

    const obj = {test: 'one'}
    expect(obj).to.matchSnapshot()
    expect(spy).to.not.equal(obj) // Due to normalize copy.
    obj.a = 'whatever'
    expect(spy).to.deep.equal(obj)
  })
})
