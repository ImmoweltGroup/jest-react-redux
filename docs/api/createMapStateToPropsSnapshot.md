# `createMapStateToPropsSnapshot({mapStateToProps: Function, ...options})`

When unit-testing your `mapStateToProps` function you would want to mock all used selectors to avoid colliding test boundaries. This function automatically mocks all of your selectors with support for mock implementations as well as snapshot testing.

#### Example usage
Testing your containers is easy, let's create an unit test for the following example `connect` configuration / container file.

```js
import {connect} from 'react-redux';
import * as selectors from './../some/folder/with/selectors.js';
import SomeComponent from './../some/folder/with/components.js';

export const mapStateToProps = (state, ownProps) => ({
  someValue: selectors.getSomeValueFromTheStore(state, {id: ownProps.id})
});
export default connect(mapStateToProps)(SomeComponent);
```

```js
import {createMapStateToPropsSnapshot} from 'jest-react-redux';
import * as selectors from './../some/folder/with/selectors.js';
import {mapStateToProps} from './index.js';

describe('mapStateToProps()', () => {
  it('should be a function', () => {
    expect(typeof mapStateToProps).toBe('function');
  });

  it('should execute all given selectors with the state and return an object containing the state props.', () => {
    const result = createMapStateToPropsSnapshot({
      mapStateToProps,
      selectors,
      selectorImplementationByKey: {
        getSomeValueFromTheStore: () => 'some mocked value from the store'
      },
      ownProps: {
        id: 'some mocked id'
      }
    });

    //
    // The variable `result` contains information about the returned stateProps from the `mapStateToProps` function,
    // as well as information about the callCount of the mocked selectors and their propagated arguments.
    //
    //  This makes it ideal to use in combination with Jests snapshot feature!
    //
    expect(result).toMatchSnapshot();
  });
});
```

#### Configuration of `createMapStateToPropsSnapshot()`
As seen in the example you need to call the `createMapStateToPropsSnapshot()` function and configure it via a simple shaped object.

```js
import {createMapStateToPropsSnapshot} from 'jest-react-redux';

const results = createMapStateToPropsSnapshot({
  // The `mapStateToProps` function under test
  mapStateToProps: Function,

  // The object or Array of objects that contains all selectors to mock during the test.
  selectors?: {[string]: Function} | Array<{[string]: Function}>,

  // An object in which the key match their `selector` function counterpart.
  // The value should be function with which you can provide the mocked implementation.
  selectorImplementationByKey?: {
    [string]: Function
  },

  // Represents the `ownProps` that will be used when calling the `mapStateToProps` function.
  ownProps?: Object,

  // Represents the `state` that will be used when calling the `mapStateToProps` function.
  state?: Object
});
```
