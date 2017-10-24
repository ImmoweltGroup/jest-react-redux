# jest-react-redux

[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Greenkeeper badge](https://badges.greenkeeper.io/ImmoweltGroup/jest-react-redux.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/jest-react-redux.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/jest-react-redux)
[![Dependency Status](https://david-dm.org/ImmoweltGroup/jest-react-redux.svg)](https://david-dm.org/ImmoweltGroup/jest-react-redux)
[![devDependency Status](https://david-dm.org/ImmoweltGroup/jest-react-redux/dev-status.svg)](https://david-dm.org/ImmoweltGroup/jest-react-redux#info=devDependencies&view=table)

> Utility functions to make snapshot testing of react-redux (e.g. mapStateToProps or mapDispatchToProps) code with Jest easier.

## Motivation
Redux applications are easy to test since they are built from small composable, pure functions, e.g. `actions`, `reducers` and `selectors`. Except for one part, the glue-code of `react-redux` requires a bit of extra setup for each test case since it calls selectors and propagates the state and custom shaped props to them.

In most applications the so called containers and their configuration/glue-code are tested in one of the following variants:

1. Not testing the `mapStateToProps` or `mapDispatchToProps` configurations at all.
2. Rendering the container manually wrapped in a `<Provider/>` with some example state / Integration test.
4. Testing the `mapStateToProps` or `mapDispatchToProps` individually as separate units.

The first variant should be a big no-no as you might guess and the second variant needs to maintain an example state shape which needs to be kept in sync, another drawback is that you bind your test code to the functionality of the `<Provider/>` which is more or less an integration test which should run in separate sessions to avoid conflicting test boundaries (Therefore the DX goes down since you need to keep two test runners / sessions open while developing your application).

We opted for the third variant since it is the cleanest but we found that manually setting up mocks for all used selectors is tedious and if we don't mock them at all we get confusing error messages in your tests since the test boundaries are not clear, e.g. if one of the selectors has an internal error it will be propagated up into our `mapStateToProps` test.

We also wanted to use the snapshot feature of Jest since it increases our DX dramatically, but building a result object for the snapshot in each test is a hassle, hence this package was born.

## Usage
If you want to use the  `jest-react-redux`, you can install it by executing:
```bash
# With npm
npm i -D jest-react-redux

# or with yarn
yarn add --dev jest-react-redux
```

Afterwards integrate it into your tests, e.g with the following `connect` configuration

```js
import {connect} from 'react-redux';
import * as selectors from './../some/folder/with/selectors.js';
import SomeComponent from './../some/folder/with/components.js';

export const mapStateToProps = (state, ownProps) => ({
  someValue: selectors.getSomeValueFromTheStore(state, {id: ownProps.id})
});
export default connect(mapStateToProps)(SomeComponent);
```

... your unit test code should look like this.

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
        getSomeValueFromTheStore: jest.fn(() => 'some mocked value from the store')
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

## API
As seen in the example you need to call the `createMapStateToPropsSnapshot()` function and configure it via a simple shaped object.

### `createMapStateToPropsSnapshot()`
```js
import {createMapStateToPropsSnapshot} from 'jest-react-redux';
```

#### `opts.mapStateToProps`
The `mapStateToProps` function under test, it will be executed with a mock state and additional `ownProps` that you can provide as a separate option. The `mapStateToProps` function can also be a function that returns the individually cached function like described in the official `react-redux` docs.

#### `opts.selectors`
The object that contains all selectors to mock during the test.

#### `opts.selectorImplementationByKey`
An object in which the key match their `selector` function counterpart. The value should be an `jest.fn()` spy with which you can provide the mocked implementation.

#### `opts.ownProps`
An optional object with which you can specify the `ownProps` that will be used when calling the `mapStateToProps` function.

## Contributing
Please make sure that you adhere to our code style, you can validate your changes / PR by executing `npm run lint`.
Visit the [eslint-config-immowelt-react](https://github.com/ImmoweltGroup/eslint-config-immowelt-react) package for more information.

## License
See the LICENSE file at the root of the repository.
