import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'
import { expect } from 'chai'
import { setup } from '../src'

Enzyme.configure({ adapter: new Adapter() })

/**
 * The idea behind this is one could insert a custom stringifier like `flatted` for handling circular references.
 */
describe('setup custom stringifier', () => {
  it('should match snapshots with a custom stringify function', () => {
    let spy = null
    setup({ stringifyFunction: (value, replacer, space) => {
      spy = value
      return JSON.stringify(value, replacer, space)
    }})

    const obj = { test: 'one' }
    expect(obj).to.matchSnapshot()
    expect(spy).to.deep.equal(obj)
  })
})
