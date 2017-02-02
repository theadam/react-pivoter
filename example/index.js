/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React, { Component } from 'react';
import { render } from 'react-dom';
import PivotTable from 'react-pivoter';
import Pivoter from 'pivoter';

import GroupHeaders from './group_headers.js';
import Modal from './modal.js';
import input from './data.json';

const root = document.getElementById('app');

function handleTooHigh(x) {
  if (x < 100) return x;
  return <span className="too-high">{x}</span>;
}

const columns = [
  { name: 'Entity', selector: x => x[0] },
  { name: 'Product', selector: x => x[1] },
  { name: 'Manufacturer', selector: x => x[2] },
  { name: 'Class', selector: x => x[3] },
  { name: 'Category', selector: x => x[4] },
  { name: 'Quantity', selector: x => x[5] },
  { name: 'Amount', selector: x => x[6] },
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

class MyPivotTable extends Component {
  constructor(props) {
    super(props);
    this.pivoter = Pivoter({
      reducer,
      dataPoints: this.dataPoints,
      input,
      groups: [columns[2], columns[4], columns[1]],
    });
  }

  state = {
    modalData: undefined,
  }

  componentWillMount() {
    this.pivoter.subscribe(this.update);
  }

  componentWillUnmount() {
    this.pivoter.unsubscribe(this.update);
  }

  handleDataSort = sortBy => () => {
    const { config } = this.state;
    const sorted = config.dataSortBy === sortBy;
    const dir = sorted && config.dataSortDir === 'asc' ? 'desc' : 'asc';
    this.pivoter.update({ dataSortBy: sortBy, dataSortDir: dir });
  }

  sortedHeader = (text, col) => {
    const { config } = this.state;
    const sortBy = col.path.join('.');
    const sortClass = config.dataSortBy === sortBy ?
      `sort-${config.dataSortDir}` :
      '';

    return (
      <span
        className={`sorter ${sortClass}`}
        onClick={this.handleDataSort(sortBy)}
      >
        {text}
      </span>
    );
  }

  subDataPoints = [
    { title: 'Quantity', value: x => x && x.quantity, formatter: x => handleTooHigh(x) },
    { title: 'Amount', value: x => (x && (x.sum / x.count)) || 0, formatter: x => Number(x).toFixed(0) },
  ];

  dataPoints = [
    {
      title: 'Economy',
      value: x => x && x.Economy,
      subDataPoints: this.subDataPoints.map(p => (
        { ...p, headerFormatter: this.sortedHeader }
      )),
    },
    { title: 'Regular', value: x => x && x.Regular, subDataPoints: this.subDataPoints },
    { title: 'Deluxe', value: x => x && x.Deluxe, subDataPoints: this.subDataPoints },
    { title: 'Grand Total', value: x => x && x.total, subDataPoints: this.subDataPoints },
  ];

  handleInputFilter = newInput => this.pivoter.update({ input: newInput })
  handleGroupSorts = groupSorts => this.pivoter.update({ groupSorts })
  update = (data, config) => this.setState({ data, config });
  closeModal = () => this.setState({ modalData: undefined });

  renderCell = (text, col, row) => {
    const parentReduced = col.parent.selector(row.reduced);

    return (
      <div
        className="cell"
        onDoubleClick={() => this.setState({
          modalData: parentReduced ? parentReduced.points : [],
          col,
          row,
        })}
      >
        {text}
      </div>
    );
  }

  render() {
    const { config, data, modalData, row, col } = this.state;

    return (
      <div>
        <PivotTable
          data={data}
          config={config}
          renderCell={this.renderCell}
          renderTotalCell={this.renderCell}
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
        <Modal
          data={modalData}
          columns={columns}
          onRequestClose={this.closeModal}
          row={row}
          col={col}
        />
      </div>
    );
  }


}


render(<MyPivotTable />, root);

