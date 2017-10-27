// @flow

export type MapType = {
  [string]: Function
};

function resolveMapForKey(
  selectors: MapType | Array<MapType>,
  key: string
): MapType {
  if (selectors instanceof Array) {
    return selectors.find(selectors => selectors[key]) || {};
  }

  return selectors;
}

module.exports = resolveMapForKey;
