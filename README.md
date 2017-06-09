# Mocha Snapshots
Snapshot/regression testing for using with Mocha, specially for React+Enzyme users.

\* _Jest is cool but too slow!_

## Install it
`npm i mocha-snapshots --save`

## Use it
```es6
import matchSnapshots from 'mocha-snapshots';
import { shallow } from 'enzyme';
import MyComponent from './path/to/MyComponent';

describe('<MyComponent />', () => {
  it('should match snapshot', function() { // Arrow functions are not allowed here
    const wrapper = shallow(<MyComponent />)
    matchSnapshot(this)(wrapper);
    matchSnapshot(this)('you can match strings');
    matchSnapshot(this)(123); // numbers too
    matchSnapshot(this)({ a: 1, b: { c: 1 } }); // or any object
  });
});
```

## Update snapshots
Set an environment variable `UPDATE` and run your test script:

ex: `UPDATE=1 npm test`