/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React, { Component } from 'react';
import { render } from 'react-dom';
import PivotTable from 'react-pivoter';
import Pivoter from 'pivoter';

import GroupHeaders from './group_headers.js';
import input from './data.json';

const root = document.getElementById('app');

function handleTooHigh(x) {
  if (x < 100) return x;
  return <span className="too-high">{x}</span>;
}

const subDataPoints = [
  { title: 'Quantity', value: x => x && x.quantity, formatter: x => handleTooHigh(x) },
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
      points: (dataTotal.points || []).concat([row]),
    },
    [type]: {
      count: (dataType.count || 0) + 1,
      sum: (dataType.sum || 0) + value,
      quantity: (dataType.quantity || 0) + quantity,
      points: (dataType.points || []).concat([row]),
    },
  };
}

function renderCell(text, col, row) {
  return (
    <div
      className="cell"
      onDoubleClick={() => console.log(col.parent.selector(row.reduced).points)}
    >
      {text}
    </div>
  );
}

class MyPivotTable extends Component {
  constructor(props) {
    super(props);
    this.pivoter = Pivoter({
      reducer,
      dataPoints,
      input,
      groups: [allGroups[0], allGroups[1], allGroups[3]],
    });
  }

  componentWillMount() {
    this.pivoter.subscribe(this.update);
  }

  componentWillUnmount() {
    this.pivoter.unsubscribe(this.update);
  }

  handleInputFilter = newInput => this.pivoter.update({ input: newInput })
  handleGroupSorts = groupSorts => this.pivoter.update({ groupSorts })
  update = (data, config) => this.setState({ data, config });

  render() {
    const { config, data } = this.state;

    return (
      <PivotTable
        data={data}
        config={config}
        groups={[allGroups[0], allGroups[1], allGroups[3]]}
        input={input}
        renderCell={renderCell}
        renderTotalCell={renderCell}
        className="table-striped pivot-hover pivot-table"
        totalText="Grand Total"
        renderGroupHeaders={(groups, width, height) =>
          <GroupHeaders
            width={width}
            height={height}
            groups={groups}
            input={input}
            config={config}
            onGroupSorts={this.handleGroupSorts}
            onInputFilter={this.handleInputFilter}
          />
        }
      />
    );
  }


}


render(<MyPivotTable />, root);

