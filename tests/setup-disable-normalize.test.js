import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, {shallow} from 'enzyme'
import {expect} from 'chai'
import {setup} from '../src'

Enzyme.configure({adapter: new Adapter()})

function MyReactComponent() {
  return (
    <div className="abc-123-45">
      Lorem Ipsum dolor
    </div>
  )
}

/**
 * This can get get in the way if someone wants to snapshot a circular-referencing object.
 * So let's verify we can disable it.
 */
describe('setup disable normalize', () => {
  it('should match snapshots with normalize disabled', () => {
    setup({normalize: false})
    const wrapper = shallow(<MyReactComponent/>)

    expect(wrapper).to.matchSnapshot()
    expect(123).to.matchSnapshot()
    expect({a: 1, b: {c: 'lorem'}}).to.matchSnapshot()
  })
})
