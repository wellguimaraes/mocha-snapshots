# Chai Snapshots
Snapshot/regression testing for using with Chai, specially for React+Enzyme users.

**Based on mocha-snapshot https://github.com/wellguimaraes/mocha-snapshots**

It has incompatible difference - it uses `pretty-print` instead of JSON

## Install it
`npm i chai-snapshots --save-dev`

## Use it
```es6
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MyComponent from './path/to/MyComponent';

describe('<MyComponent />', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<MyComponent />)
    
    // You can match Enzyme wrappers
    expect(wrapper).to.matchSnapshot();
    
    // Strings
    expect('you can match strings').to.matchSnapshot();
    
    // Numbers
    expect(123).to.matchSnapshot();
    
    // Or any object
    expect({ a: 1, b: { c: 1 } }).to.matchSnapshot();
   
  });
});
```

## Run your tests
Add a require argument to your test script/command 

`mocha --require chai-snapshots`

## Disable classNames cleanup
To prevent false mismatches, mocha-snapshots sanitizes className props by default. You can disable this behavior before running your tests:
```js
import mochaSnapshots from 'chai-snapshots';

mochaSnapshots.setup({ sanitizeClassNames: false })
```

## Update snapshots
Set an environment variable `UPDATE` and run your test script or add the flag `--update`  when running Mocha:

```
UPDATE=1 mocha --require chai-snapshots
``` 
or
```
mocha --require chai-snapshots --update
```
