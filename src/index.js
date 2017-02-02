import React, { Component, PropTypes } from 'react';

import { subPath, columnTree, dataGetterFrom, isOpen } from './utils';
import PivotHeader from './pivot_header';
import PivotBody from './pivot_body';
import PivotTotal from './pivot_total';

export default class PivotTable extends Component {
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
  }

  constructor(props) {
    super(props);

    this.state = {
      opens: [],
    };
  }

  handleOpen = (path) => {
    if (isOpen(path, this.state.opens)) {
      this.setState({ opens: this.state.opens.filter(open => !subPath(path, open)) });
    } else {
      this.setState({ opens: this.state.opens.concat([path]) });
    }
  }

  maxOpen = () => this.state.opens.reduce((acc, v) => Math.max(acc, v.length + 1), 1);

  render() {
    const { opens } = this.state;
    const { renderHeader, renderCell, renderGroup, renderGroupHeaders,
      totalText, renderTotalGroup, renderTotalCell, config, data } = this.props;
    const { groups } = config;
    const columns = columnTree(data, config);
    const dataGetter = dataGetterFrom(columns);
    const maxOpen = this.maxOpen();

    return (
      <table className={this.props.className}>
        <PivotHeader
          columnTree={columns}
          renderHeader={renderHeader}
          renderGroupHeaders={renderGroupHeaders}
          maxOpen={maxOpen}
          groups={groups}
        />
        <PivotBody
          flattened={data.flattened}
          dataGetter={dataGetter}
          renderCell={renderCell}
          renderGroup={renderGroup}
          opens={opens}
          maxOpen={maxOpen}
          onToggleOpen={this.handleOpen}
          groups={groups}
        />
        <PivotTotal
          totalText={totalText}
          total={data.total}
          dataGetter={dataGetter}
          renderTotalGroup={renderTotalGroup}
          renderTotalCell={renderTotalCell}
          maxOpen={maxOpen}
        />
      </table>
    );
  }
}
