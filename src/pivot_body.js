import React, { Component, PropTypes } from 'react';

import { isOpen, range, last } from './utils';

export default class PivotBody extends Component {
  static propTypes = {
    dataGetter: PropTypes.func.isRequired,
    flattened: PropTypes.array.isRequired,
    renderCell: PropTypes.func,
    renderGroup: PropTypes.func,
    opens: PropTypes.object.isRequired,
    maxOpen: PropTypes.number.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired,
  }

  static defaultProps = {
    renderCell: data => data,
    renderGroup: group => group,
  }

  getCellClassName(col) {
    return [
      col.groupStart && col.path.length > 0 && 'group-start',
      'data',
    ].filter(v => !!v).join(' ');
  }

  getGroupClassName(row) {
    const hasSubGroups = !!row.subGroups;
    return [
      hasSubGroups && this.isOpen(row.path) && 'open',
      hasSubGroups && !this.isOpen(row.path) && 'closed',
      'group',
    ].filter(v => !!v).join(' ');
  }

  isShowing = row => this.isOpen(row.path.slice(0, -1));
  isOpen = (path) => {
    if (path.length === 0) return true;
    return isOpen(path, this.props.opens);
  }

  handleGroupClick = row => () => {
    if (row.subGroups) {
      this.props.onToggleOpen(row.path);
    }
  }

  renderGroup(row) {
    const { groups, renderGroup } = this.props;
    const group = groups[row.level];
    const text = (group.formatter || (x => x))(last(row.path, row));

    return renderGroup(text, group, row);
  }


  render() {
    const { flattened, dataGetter, renderCell, maxOpen } = this.props;

    return (
      <tbody>
        { flattened.filter(this.isShowing).map(row =>
          <tr key={`${Object.values(row.projection).join('#')}#${row.level}`}>
            { row.path.slice(0, -1).map((v, i) =>
              <td className="before-group" key={i} />
            ) }
            <td
              onClick={this.handleGroupClick(row)}
              className={this.getGroupClassName(row)}
            >
              { this.renderGroup(row) }
            </td>
            { range(0, maxOpen - row.level - 1).map((v, i) =>
              <td
                onClick={this.handleGroupClick(row)}
                className="after-group" key={i}
              />
            ) }
            { dataGetter(row.data).map(({ col, data }) =>
              <td
                key={col.path.join('#')}
                className={this.getCellClassName(col)}
              >
                { renderCell(col.format(data, col, row), col, row) }
              </td>
            ) }
          </tr>
        )}
      </tbody>
    );
  }
}
