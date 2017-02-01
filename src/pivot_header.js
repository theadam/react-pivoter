import React, { Component, PropTypes } from 'react';

import { range } from './utils';

export default class PivotHeader extends Component {
  static propTypes = {
    columnTree: PropTypes.array.isRequired,
    renderHeader: PropTypes.func,
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

  static defaultProps = {
    renderHeader: text => text,
  }

  renderGroupHeader() {
    const { columnTree, maxOpen, groups } = this.props;

    return range(0, maxOpen).map(idx => groups[idx]).map(group =>
      <th
        className="group-header"
        rowSpan={columnTree.length}
        key={group.name}
      >
        {group.name}
      </th>
    );
  }

  render() {
    const { columnTree, renderHeader } = this.props;

    return (
      <thead>
        { columnTree.map((row, i) =>
          <tr key={i}>
            { i === 0 && this.renderGroupHeader() }
            { row.map(col =>
              <th
                rowSpan={col.rowSpan}
                colSpan={col.colSpan}
                key={col.path.join('#')}
                className={PivotHeader.getClassName(col)}
              >
                { renderHeader(col.headerFormat(col.text), col, row) }
              </th>
            ) }
          </tr>
        )}
      </thead>
    );
  }
}
