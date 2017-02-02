import React, { Component, PropTypes } from 'react';

import { range } from './utils';

export default class PivotHeader extends Component {
  static propTypes = {
    columnTree: PropTypes.array.isRequired,
    renderHeader: PropTypes.func,
    renderGroupHeaders: PropTypes.func,
    maxOpen: PropTypes.number.isRequired,
    groups: PropTypes.array.isRequired,
  }

  static getClassName(col) {
    return [
      col.groupStart && col.path.length > 0 && 'group-start',
      col.hasChildren && 'parent',
      col.leaf && 'leaf',
    ].filter(v => !!v).join(' ');
  }

  static renderGroupHeaders(groups, width, height) {
    return range(0, width).map(idx => groups[idx]).map((group) => {
      const format = group.headerFormatter || (x => x);

      return (
        <th
          className="group-header"
          rowSpan={height}
          key={group.name}
        >
          {format(group.name, group)}
        </th>
      );
    });
  }

  static defaultProps = {
    renderHeader: text => text,
    renderGroupHeaders: (...args) => PivotHeader.renderGroupHeaders(...args),
  }

  renderGroupHeaders() {
    const { columnTree, maxOpen, groups, renderGroupHeaders } = this.props;

    return renderGroupHeaders(groups, maxOpen, columnTree.length);
  }

  render() {
    const { columnTree, renderHeader } = this.props;

    return (
      <thead>
        { columnTree.map((row, i) =>
          <tr key={i}>
            { i === 0 && this.renderGroupHeaders() }
            { row.map(col =>
              <th
                rowSpan={col.rowSpan}
                colSpan={col.colSpan}
                key={col.path.join('#')}
                className={PivotHeader.getClassName(col)}
              >
                { renderHeader(col.headerFormat(col.text, col, row), col, row) }
              </th>
            ) }
          </tr>
        )}
      </thead>
    );
  }
}
