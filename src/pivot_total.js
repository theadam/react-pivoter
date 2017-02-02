import React, { Component, PropTypes } from 'react';

export default class PivotTotal extends Component {
  static propTypes = {
    totalText: PropTypes.string,
    total: PropTypes.object.isRequired,
    dataGetter: PropTypes.func.isRequired,
    renderTotalGroup: PropTypes.func,
    renderTotalCell: PropTypes.func,
    maxOpen: PropTypes.number.isRequired,
  }

  static defaultProps = {
    renderTotalGroup: text => text,
    renderTotalCell: text => text,
    totalText: 'Total',
  }

  getCellClassName(col) {
    return [
      col.groupStart && col.path.length > 0 && 'group-start',
      'total-data',
    ].filter(v => !!v).join(' ');
  }

  renderGroup() {
    const { totalText, maxOpen, total, renderTotalGroup } = this.props;

    return (
      <td
        colSpan={maxOpen}
        className="total-group"
      >
        {renderTotalGroup(totalText, total)}
      </td>
    );
  }

  renderCells() {
    const { total, dataGetter, renderTotalCell } = this.props;

    return dataGetter(total.data).map(({ col, data }) =>
      <td
        key={col.path.join('#')}
        className={this.getCellClassName(col)}
      >
        {renderTotalCell(col.format(data, col, total), col, total)}
      </td>
    );
  }

  render() {
    return (
      <tfoot>
        <tr>
          {this.renderGroup()}
          {this.renderCells()}
        </tr>
      </tfoot>
    );
  }
}
