import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'
import { expect } from 'chai'
import { setup } from '../src'

Enzyme.configure({ adapter: new Adapter() })

function MyReactComponent() {
  return (
    <div className="abc-123-45">
      Lorem Ipsum dolor
    </div>
  )
}

function MyReactComponentWithSpecialCharacters({argument}) {
  return (
    <div className="abc-123-45" argument={argument}>
      Lorem Ipsum dolor {argument} ""
    </div>
  )
}

describe('matchSnapshot', () => {
  describe('multiple tests with same it() title', () => {
    describe('title one', () => {
      it('should match snapshot', () => {
        expect(123).to.matchSnapshot()
      })
    })

    describe('title two', () => {
      it('should match snapshot', () => {
        expect(321).to.matchSnapshot()
      })
    })
  })

  it('should match snapshots', () => {
    const wrapper = shallow(<MyReactComponent/>)

    expect(wrapper).to.matchSnapshot()
    expect(123).to.matchSnapshot()
    expect({ a: 1, b: { c: 'lorem' } }).to.matchSnapshot()
  })

  it('should match snapshots with double quotes', () => {
    const wrapper = shallow(<MyReactComponentWithSpecialCharacters argument={'""'} />)

    expect(wrapper).to.matchSnapshot()
  })

  it('should match snapshots without classNames sanitization', () => {
    setup({ sanitizeClassNames: false })
    const wrapper = shallow(<MyReactComponent/>)
    expect(wrapper).to.matchSnapshot()
  })
})
