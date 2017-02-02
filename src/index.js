import React, { Component, PropTypes } from 'react';
import Pivoter from 'pivoter';

import { subPath, pick, columnTree, dataGetterFrom, isOpen } from './utils';
import PivotHeader from './pivot_header';
import PivotBody from './pivot_body';
import PivotTotal from './pivot_total';

const pivoterPropTypes = {
  reducer: PropTypes.func.isRequired,
  input: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  flattener: PropTypes.func,
  initialValue: PropTypes.any,
  dataPoints: PropTypes.array,
  groupSorts: PropTypes.array,
  dataSortBy: PropTypes.oneOf([PropTypes.string, PropTypes.array, PropTypes.func]),
  dataSortDir: PropTypes.string,
  dataSortsWith: PropTypes.func,
};

const pivoterKeys = Object.keys(pivoterPropTypes);
const pickForPivot = obj => pick(obj, pivoterKeys);


export default class PivotTable extends Component {
  static propTypes = {
    ...pivoterPropTypes,
    renderHeader: PropTypes.func,
    renderCell: PropTypes.func,
    renderGroup: PropTypes.func,
    renderTotalCell: PropTypes.func,
    renderTotalGroup: PropTypes.func,
    renderGroupHeader: PropTypes.func,
    className: PropTypes.string,
    totalText: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      pivoter: Pivoter(pickForPivot(props)),
      opens: [],
    };
  }

  componentWillMount() {
    this.state.pivoter.subscribe(this.update);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pivoter: this.state.pivoter.update(pickForPivot(nextProps)),
    });
  }

  componentWillUnmount() {
    this.state.pivoter.unsubscribe(this.update);
  }

  handleOpen = (path) => {
    if (isOpen(path, this.state.opens)) {
      this.setState({ opens: this.state.opens.filter(open => !subPath(path, open)) });
    } else {
      this.setState({ opens: this.state.opens.concat([path]) });
    }
  }

  update = (data, config) => this.setState({ data, config });
  maxOpen = () => this.state.opens.reduce((acc, v) => Math.max(acc, v.length + 1), 1);

  render() {
    const { data, config, opens } = this.state;
    const { renderHeader, renderCell, renderGroup, renderGroupHeader,
      totalText, renderTotalGroup, renderTotalCell } = this.props;
    const { groups } = config;
    const columns = columnTree(data, config);
    const dataGetter = dataGetterFrom(columns);
    const maxOpen = this.maxOpen();

    return (
      <table className={this.props.className}>
        <PivotHeader
          columnTree={columns}
          renderHeader={renderHeader}
          renderGroupHeader={renderGroupHeader}
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
