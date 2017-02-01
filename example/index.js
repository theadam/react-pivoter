/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React from 'react';
import { render } from 'react-dom';

import PivotTable from 'react-pivoter';
import input from './data.json';

const root = document.getElementById('app');

const subDataPoints = [
  { title: 'Quantity', value: x => x && x.quantity, formatter: x => x },
  { title: 'Amount', value: x => (x && (x.sum / x.count)) || 0, formatter: x => Number(x).toFixed(0) },
];

const dataPoints = [
  { title: 'Economy', value: x => x && x.Economy, subDataPoints },
  { title: 'Regular', value: x => x && x.Regular, subDataPoints },
  { title: 'Deluxe', value: x => x && x.Deluxe, subDataPoints },
  { title: 'Grand Total', value: x => x && x.total, subDataPoints },
];

const allGroups = [
  { name: 'Manufacturer', selector: x => x[2] },
  { name: 'Category', selector: x => x[4] },
  { name: 'Entity', selector: x => x[0] },
  { name: 'Product', selector: x => x[1] },
];

function reducer(data, row) {
  const type = row[3];
  const value = row[6];
  const quantity = row[5];

  const dataTotal = data.total || {};
  const dataType = data[type] || {};
  return {
    ...data,
    total: {
      count: (dataTotal.count || 0) + 1,
      sum: (dataTotal.sum || 0) + value,
      quantity: (dataTotal.quantity || 0) + quantity,
    },
    [type]: {
      count: (dataType.count || 0) + 1,
      sum: (dataType.sum || 0) + value,
      quantity: (dataType.quantity || 0) + quantity,
    },
  };
}

function renderCell(text, col, row) {
  return (
    <span
      onDoubleClick={() => console.log(row.points)}
    >
      {text}
    </span>
  );
}

render(
  <PivotTable
    reducer={reducer}
    groups={[allGroups[0], allGroups[1], allGroups[3]]}
    dataPoints={dataPoints}
    input={input}
    renderCell={renderCell}
    className="table pivot-hover pivot-table"
  />,
  root
);
