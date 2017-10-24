// @flow

type OptsType = {
  mapStateToProps: Function,
  selectors?: {
    [string]: Function
  },
  selectorImplementationByKey?: {
    [string]: Function
  },
  ownProps?: Object
};

function createMapStateToPropsSnapshot(opts: OptsType) {
  const {
    mapStateToProps,
    selectors = {},
    selectorImplementationByKey = {},
    ownProps = {}
  } = opts;
  const state = {__mockState: true};
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
    const implementation = selectorImplementationByKey[selectorKey];

    selectorSpiesByKey[selectorKey] = jest
      .spyOn(selectors, selectorKey)
      .mockImplementation(implementation);
  });

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
    const args = spy.mock.calls;

    calls[selectorKey] = {
      callCount,
      args
    };

    spy.mockRestore();
  });

  return {
    calls,
    stateProps
  };
}

module.exports = createMapStateToPropsSnapshot;
