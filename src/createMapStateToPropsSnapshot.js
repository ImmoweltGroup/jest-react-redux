// @flow

type SelectorsMap = {
  [string]: Function
};
type OptsType = {
  mapStateToProps: Function,
  selectors?: SelectorsMap | Array<SelectorsMap>,
  selectorImplementationByKey?: {
    [string]: Function
  },
  ownProps?: Object,
  state?: Object
};

const resolveMapForKey = require('./lib/resolveMapForKey.js');

function createMapStateToPropsSnapshot(
  opts: OptsType
): {calls: Object, stateProps: Object} {
  const {
    mapStateToProps,
    selectors = {},
    selectorImplementationByKey = {},
    ownProps = {__mockOwnProps: true},
    state = {__mockState: true}
  } = opts;
  const selectorKeys = Object.keys(selectorImplementationByKey);
  const selectorSpiesByKey = {};
  let stateProps = {};
  let calls = {};

  if (typeof mapStateToProps !== 'function') {
    throw new Error(
      'Please provide at least an object containing the mapStateToProps() function to the createMapStateToPropsSnapshot() utility.'
    );
  }

  //
  // Mock all selectors with the provided implementations.
  //
  selectorKeys.forEach(selectorKey => {
    const selectorsMap = resolveMapForKey(selectors, selectorKey);
    const implementation = selectorImplementationByKey[selectorKey];

    selectorSpiesByKey[selectorKey] = jest
      .spyOn(selectorsMap, selectorKey)
      .mockImplementation(implementation);
  });

  //
  // Execute the `mapStateToProps` to test if it works correctly and to collect all informations on the spy instances of all selectors.
  //
  expect(() => {
    const results = mapStateToProps(state, ownProps);

    if (typeof results === 'function') {
      stateProps = results(state, ownProps);
    } else {
      stateProps = results;
    }
  }).not.toThrow();

  //
  // Reset mocks and combine the results for the snapshot.
  //
  selectorKeys.forEach(selectorKey => {
    const spy = selectorSpiesByKey[selectorKey];
    const callCount = spy.mock.calls.length;
    const argsByCallCount = spy.mock.calls.reduce(
      (argsByCallCount, args, index) => {
        argsByCallCount[index] = args;

        return argsByCallCount;
      },
      {}
    );

    calls[selectorKey] = {
      callCount,
      argsByCallCount
    };

    spy.mockRestore();
  });

  return {
    calls,
    stateProps
  };
}

module.exports = createMapStateToPropsSnapshot;
