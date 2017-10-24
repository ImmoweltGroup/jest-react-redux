const createMapStateToPropsSnapshot = require('./createMapStateToPropsSnapshot.js');

describe('createMapStateToPropsSnapshot()', () => {
  it('should be a function.', () => {
    expect(typeof createMapStateToPropsSnapshot).toBe('function');
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
});
