// @flow

const resolveMapForKey = require('./resolveMapForKey.js');

describe('resolveMapForKey()', () => {
  it('should be a function.', () => {
    expect(typeof resolveMapForKey).toBe('function');
  });

  it('should return the map in which the given key was found.', () => {
    const map = {foo: jest.fn()};

    expect(resolveMapForKey(map, 'foo')).toBe(map);
  });

  it('should support an array of maps as the target.', () => {
    const map = {foo: jest.fn()};

    expect(resolveMapForKey([{}, map, {}], 'foo')).toBe(map);
  });
});
