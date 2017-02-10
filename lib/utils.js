'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getIn = getIn;
exports.last = last;
exports.range = range;
exports.columnTree = columnTree;
exports.dataGetterFrom = dataGetterFrom;
exports.subPath = subPath;
exports.isOpen = isOpen;
exports.updateOpens = updateOpens;
exports.maxOpen = maxOpen;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function getIn(obj, path) {
  if (path.length === 0) return obj;

  var _path = _toArray(path),
      head = _path[0],
      tail = _path.slice(1);

  return getIn(obj && obj[head], tail);
}

function last(ary) {
  return ary[ary.length - 1];
}

function range(start, end) {
  if (start >= end) return [];
  return [start].concat(range(start + 1, end));
}

function toPoints(reduced) {
  return Object.keys(reduced).map(function (key) {
    return {
      title: key,
      value: function value(x) {
        return x[key];
      },
      subDataPoints: _typeof(reduced[key]) !== 'object' ? undefined : toPoints(reduced[key])
    };
  });
}

function singleHeight(point) {
  if (!point) return 0;
  // eslint-disable-next-line no-use-before-define
  return 1 + height(point.subDataPoints);
}

function height(points) {
  if (!points) return 0;
  return Math.max.apply(Math, [0].concat(_toConsumableArray(points.map(singleHeight))));
}

function singleWidth(point) {
  if (!point) return 0;
  // eslint-disable-next-line no-use-before-define
  return Math.max(1, width(point.subDataPoints));
}

function width(points) {
  if (!points) return 0;
  return points.reduce(function (acc, v) {
    return acc + singleWidth(v);
  }, 0);
}

function singleTree(point, heightLeft, i, parent) {
  var pointHeight = singleHeight(point);
  var diff = pointHeight - heightLeft;
  var nextHeight = pointHeight - 1;
  var basepath = parent && parent.path || [];
  var baseselector = parent && parent.selector || function (v) {
    return v;
  };
  var newPath = basepath.concat(point.title);
  var value = point.value || function (v) {
    return v;
  };
  var selector = function selector(v) {
    return value(baseselector(v));
  };

  var col = {
    selector: selector,
    parent: parent,
    text: point.title,
    colSpan: singleWidth(point),
    rowSpan: diff + 1,
    hasChildren: nextHeight !== 0,
    leaf: nextHeight === 0,
    groupStart: i === 0,
    path: newPath,
    format: point.formatter || function (x) {
      return x;
    },
    headerFormat: point.headerFormatter || function (x) {
      return x;
    }
  };

  return [[col]].concat(range(0, diff).map(function () {
    return [];
  }))
  // eslint-disable-next-line no-use-before-define
  .concat(columnTreeFromPoints(point.subDataPoints, nextHeight, col));
}

function zipTree(left, right) {
  return right.map(function (v, i) {
    return (left[i] || []).concat(v);
  });
}

function columnTreeFromPoints(points) {
  var heightLeft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : height(points);
  var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  if (!points) return [];
  return points.reduce(function (acc, v, i) {
    var tree = singleTree(v, heightLeft, i, parent);
    return zipTree(acc, tree);
  }, []);
}

function columnTreeFromReduced(reduced) {
  return columnTreeFromPoints(toPoints(reduced));
}

function columnTree(_ref, _ref2) {
  var total = _ref.total;
  var dataPoints = _ref2.dataPoints;

  if (dataPoints) return columnTreeFromPoints(dataPoints);
  return columnTreeFromReduced(total);
}

function dataGetterFrom(columns) {
  return function (data) {
    return last(columns).map(function (col) {
      return { col: col, data: getIn(data, col.path) };
    });
  };
}

function subPath(a, b) {
  return a.every(function (v, i) {
    return b[i] === v;
  });
}

function isOpen(path, opens) {
  if (opens === undefined) return false;
  if (path.length === 0) return true;

  var _path2 = _toArray(path),
      head = _path2[0],
      tail = _path2.slice(1);

  return isOpen(tail, opens[head]);
}

function close(opens, path) {
  if (path.length === 1) return _extends({}, opens, _defineProperty({}, path[0], undefined));

  var _path3 = _toArray(path),
      head = _path3[0],
      tail = _path3.slice(1);

  return _extends({}, opens, _defineProperty({}, head, close(opens[head], tail)));
}

function open(opens, path) {
  if (path.length === 0) return {};

  var _path4 = _toArray(path),
      head = _path4[0],
      tail = _path4.slice(1);

  return _extends({}, opens, _defineProperty({}, head, open(opens[head], tail)));
}

function updateOpens(opens, path) {
  if (isOpen(path, opens)) {
    return close(opens, path);
  }
  return open(opens, path);
}

function maxOpen(opens) {
  if (!opens) return 0;
  return Math.max.apply(Math, [0].concat(_toConsumableArray(Object.keys(opens).map(function (head) {
    return maxOpen(opens[head]);
  })))) + 1;
}