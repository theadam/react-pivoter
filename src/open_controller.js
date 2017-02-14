import React, { Component, PropTypes } from 'react';

import { updateOpens, maxOpen } from './utils';
import PivotHeader from './pivot_header';
import PivotBody from './pivot_body';
import PivotTotal from './pivot_total';

export default class OpenController extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    renderHeader: PropTypes.func,
    renderCell: PropTypes.func,
    renderGroup: PropTypes.func,
    renderTotalCell: PropTypes.func,
    renderTotalGroup: PropTypes.func,
    renderGroupHeaders: PropTypes.func,
    className: PropTypes.string,
    totalText: PropTypes.string,
    columnTree: PropTypes.array.isRequired,
    dataGetter: PropTypes.func.isRequired,
    afterGroups: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      opens: {},
    };
  }

  handleOpen = (path) => {
    this.setState({ opens: updateOpens(this.state.opens, path) });
  }

  render() {
    const { opens } = this.state;
    const { renderHeader, renderCell, renderGroup, renderGroupHeaders,
      totalText, renderTotalGroup, renderTotalCell, config, data,
      columnTree, dataGetter, afterGroups,
    } = this.props;
    const { groups } = config;
    const openMax = maxOpen(opens);

    return (
      <table className={this.props.className}>
        <PivotHeader
          columnTree={columnTree}
          renderHeader={renderHeader}
          renderGroupHeaders={renderGroupHeaders}
          maxOpen={openMax}
          groups={groups}
        />
        <PivotBody
          afterGroups={afterGroups}
          flattened={data.flattened}
          dataGetter={dataGetter}
          renderCell={renderCell}
          renderGroup={renderGroup}
          opens={opens}
          maxOpen={openMax}
          onToggleOpen={this.handleOpen}
          groups={groups}
        />
        <PivotTotal
          totalText={totalText}
          total={data.total}
          dataGetter={dataGetter}
          renderTotalGroup={renderTotalGroup}
          renderTotalCell={renderTotalCell}
          maxOpen={openMax}
        />
      </table>
    );
  }
}

