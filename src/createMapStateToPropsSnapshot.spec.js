const createMapStateToPropsSnapshot = require('./createMapStateToPropsSnapshot.js');

describe('createMapStateToPropsSnapshot()', () => {
  it('should be a function.', () => {
    expect(typeof createMapStateToPropsSnapshot).toBe('function');
  });

  it('should throw an error if no mapStateToProps function was passed.', () => {
    expect(() => createMapStateToPropsSnapshot({})).toThrow();
  });

  it('should not throw error if no option keys where passed.', () => {
    expect(() =>
      createMapStateToPropsSnapshot({
        mapStateToProps: jest.fn()
      })
    ).not.toThrow();
  });

  it('should mock all selectors and return an output that can be easily compared via Jests snapshot feature.', () => {
    const selectors = {
      getFoo: (state, ownProps) => 'foo'
    };
    const mapStateToProps = (state, ownProps) => ({
      foo: selectors.getFoo(state, ownProps)
    });
    const ownProps = {barOwnProp: 'bar'};
    const results = createMapStateToPropsSnapshot({
      mapStateToProps,
      selectors,
      ownProps,
      selectorImplementationByKey: {
        getFoo: jest.fn(() => 'Some mocked value for getFoo')
      }
    });

    expect(results).toEqual({
      calls: {
        getFoo: {
          args: [[{__mockState: true}, ownProps]],
          callCount: 1
        }
      },
      stateProps: {
        foo: 'Some mocked value for getFoo'
      }
    });
  });

  it('should support the the mapStateToProps function has caching capabilities via the curry-fn concept.', () => {
    const selectors = {
      getFoo: (state, ownProps) => 'foo'
    };
    const mapStateToProps = () => (state, ownProps) => ({
      foo: selectors.getFoo(state, ownProps)
    });
    const ownProps = {barOwnProp: 'bar'};
    const results = createMapStateToPropsSnapshot({
      mapStateToProps,
      selectors,
      ownProps,
      selectorImplementationByKey: {
        getFoo: jest.fn(() => 'Some mocked value for getFoo')
      }
    });

    expect(results).toEqual({
      calls: {
        getFoo: {
          args: [[{__mockState: true}, ownProps]],
          callCount: 1
        }
      },
      stateProps: {
        foo: 'Some mocked value for getFoo'
      }
    });
  });

  it('should support an array of selector maps to be passed.', () => {
    const selectors = [
      {
        getFoo: (state, ownProps) => 'foo'
      }
    ];
    const mapStateToProps = () => (state, ownProps) => ({
      foo: selectors[0].getFoo(state, ownProps)
    });
    const ownProps = {barOwnProp: 'bar'};
    const results = createMapStateToPropsSnapshot({
      mapStateToProps,
      selectors,
      ownProps,
      selectorImplementationByKey: {
        getFoo: jest.fn(() => 'Some mocked value for getFoo')
      }
    });

    expect(results).toEqual({
      calls: {
        getFoo: {
          args: [[{__mockState: true}, ownProps]],
          callCount: 1
        }
      },
      stateProps: {
        foo: 'Some mocked value for getFoo'
      }
    });
  });

  it('should support custom state to be used from the options.', () => {
    const selectors = [
      {
        getFoo: (state, ownProps) => 'foo'
      }
    ];
    const mapStateToProps = () => (state, ownProps) => ({
      foo: selectors[0].getFoo(state, ownProps)
    });
    const ownProps = {barOwnProp: 'bar'};
    const state = {barState: true};
    const results = createMapStateToPropsSnapshot({
      mapStateToProps,
      selectors,
      ownProps,
      state,
      selectorImplementationByKey: {
        getFoo: jest.fn(() => 'Some mocked value for getFoo')
      }
    });

    expect(results).toEqual({
      calls: {
        getFoo: {
          args: [[state, ownProps]],
          callCount: 1
        }
      },
      stateProps: {
        foo: 'Some mocked value for getFoo'
      }
    });
  });
});
