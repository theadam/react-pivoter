export function getIn(obj, path) {
  if (path.length === 0) return obj;
  const [head, ...tail] = path;
  return getIn(obj && obj[head], tail);
}

export function last(ary) {
  return ary[ary.length - 1];
}

export function range(start, end) {
  if (start >= end) return [];
  return [start].concat(range(start + 1, end));
}

function toPoints(reduced) {
  return Object.keys(reduced).map(key => (
    {
      title: key,
      value: x => x[key],
      subDataPoints: typeof reduced[key] !== 'object' ?
        undefined :
        toPoints(reduced[key]),
    }
  ));
}

function singleHeight(point) {
  if (!point) return 0;
  // eslint-disable-next-line no-use-before-define
  return 1 + height(point.subDataPoints);
}

function height(points) {
  if (!points) return 0;
  return Math.max(0, ...points.map(singleHeight));
}

function singleWidth(point) {
  if (!point) return 0;
  // eslint-disable-next-line no-use-before-define
  return Math.max(1, width(point.subDataPoints));
}

function width(points) {
  if (!points) return 0;
  return points.reduce((acc, v) => acc + singleWidth(v), 0);
}

function singleTree(point, heightLeft, i, parent) {
  const pointHeight = singleHeight(point);
  const diff = pointHeight - heightLeft;
  const nextHeight = pointHeight - 1;
  const basepath = (parent && parent.path) || [];
  const baseselector = (parent && parent.selector) || (v => v);
  const newPath = basepath.concat(point.title);
  const value = point.value || (v => v);
  const selector = v => value(baseselector(v));

  const col = {
    selector,
    parent,
    text: point.title,
    colSpan: singleWidth(point),
    rowSpan: diff + 1,
    hasChildren: nextHeight !== 0,
    leaf: nextHeight === 0,
    groupStart: i === 0,
    path: newPath,
    format: point.formatter || (x => x),
    headerFormat: point.headerFormatter || (x => x),
  };

  return [[col]]
    .concat(range(0, diff).map(() => []))
    // eslint-disable-next-line no-use-before-define
    .concat(columnTreeFromPoints(point.subDataPoints, nextHeight, col));
}

function zipTree(left, right) {
  return right.map((v, i) =>
    (left[i] || []).concat(v)
  );
}

function columnTreeFromPoints(points, heightLeft = height(points), parent = undefined) {
  if (!points) return [];
  return points.reduce((acc, v, i) => {
    const tree = singleTree(v, heightLeft, i, parent);
    return zipTree(acc, tree);
  }, []);
}

function columnTreeFromReduced(reduced) {
  return columnTreeFromPoints(toPoints(reduced));
}

export function columnTree({ total }, { dataPoints }) {
  if (dataPoints) return columnTreeFromPoints(dataPoints);
  return columnTreeFromReduced(total.reduced);
}

export function dataGetterFrom(columns) {
  return data => last(columns).map(col => ({ col, data: getIn(data, col.path) }));
}

export function subPath(a, b) {
  return a.every((v, i) => b[i] === v);
}

export function isOpen(path, opens) {
  if (opens === undefined) return false;
  if (path.length === 0) return true;
  const [head, ...tail] = path;
  return isOpen(tail, opens[head]);
}

function close(opens, path) {
  if (path.length === 1) return { ...opens, [path[0]]: undefined };
  const [head, ...tail] = path;
  return {
    ...opens,
    [head]: close(opens[head], tail),
  };
}

function open(opens, path) {
  if (path.length === 0) return {};
  const [head, ...tail] = path;
  return {
    ...opens,
    [head]: open(opens[head], tail),
  };
}

export function updateOpens(opens, path) {
  if (isOpen(path, opens)) {
    return close(opens, path);
  }
  return open(opens, path);
}

export function maxOpen(opens) {
  if (!opens) return 0;
  return Math.max(0, ...Object.keys(opens).map(head => maxOpen(opens[head]))) + 1;
}

