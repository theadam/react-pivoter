import { chain } from 'pivoter/lib/utils';

export function pick(obj, props) {
  return props.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

export function getIn(obj, path) {
  if (path.length === 0) return obj;
  const [head, ...tail ] = path;
  return getIn(obj && obj[head], tail);
}

export function last(ary) {
  return ary[ary.length - 1];
}

export function range(start, end) {
  if (start >= end) return [];
  return [start].concat(range(start + 1, end));
}

export function columnTree({ total }, { dataPoints }) {
  if (dataPoints) return columnTreeFromPoints(dataPoints);
  return columnTreeFromReduced(total);
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

function columnTreeFromReduced(reduced) {
  return columnTreeFromPoints(toPoints(reduced));
}

function singleHeight(point) {
  if (!point) return 0;
  return 1 + height(point.subDataPoints);
}

function height(points) {
  if (!points) return 0;
  return points.reduce((acc, v) => Math.max(acc, singleHeight(v)), 0);
}

function singleWidth(point) {
  if (!point) return 0;
  return Math.max(1, width(point.subDataPoints));
}

function width(points) {
  if (!points) return 0;
  return points.reduce((acc, v) => acc + singleWidth(v), 0);
}

function singleTree(point, heightLeft, i, basepath) {
  const pointHeight = singleHeight(point);
  const diff = pointHeight - heightLeft;
  const nextHeight = pointHeight - 1;
  const newPath = basepath.concat(point.title);

  return [[{
    text: point.title,
    colSpan: singleWidth(point),
    rowSpan: diff + 1,
    hasChildren: nextHeight !== 0,
    leaf: nextHeight === 0,
    groupStart: i === 0,
    path: newPath,
    format: point.formatter || (x => x),
    headerFormat: point.headerFormatter || (x => x),
  }]]
    .concat(range(0, diff).map(() => []))
    .concat(columnTreeFromPoints(point.subDataPoints, nextHeight, newPath));
}

function zipTree(left, right) {
  return right.map((v, i) =>
    (left[i] || []).concat(v)
  );
}

function columnTreeFromPoints(points, heightLeft = height(points), basepath = []) {
  if (!points) return [];
  return points.reduce((acc, v, i) => {
    const tree = singleTree(v, heightLeft, i, basepath);
    return zipTree(acc, tree);
  }, []);
}


export function dataGetterFrom(columns) {
  return data => last(columns).map(col => ({ col, data: getIn(data, col.path) }));
}

export function subPath(a, b) {
  return a.every((v, i) => b[i] === v);
}

function samePath(a, b) {
  return a.length === b.length &&
    subPath(a, b);
}

export function isOpen(path, opens) {
  return opens.some(open => samePath(path, open));
}
