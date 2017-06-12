import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

function MyReactComponent() {
  return (
    <div className="abc-234-45">
      Lorem Ipsum dolor
    </div>
  );
}

describe('matchSnapshot', () => {
  it('should match snapshots', () => {
    const wrapper = shallow(<MyReactComponent />);

    expect(wrapper).to.matchSnapshot();
    expect(123).to.matchSnapshot();
    expect({ a: 1, b: { c: 'lorem' } }).to.matchSnapshot();
  });
});