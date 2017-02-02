import React, { Component, PropTypes } from 'react';

import FilterMenu, { shallowEquals } from './filter_menu';

function range(start, end) {
  if (start >= end) return [];
  return [start].concat(range(start + 1, end));
}

export default class GroupHeaders extends Component {
  static propTypes = {
    input: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    config: PropTypes.object,
    onGroupSorts: PropTypes.func.isRequired,
    onInputFilter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      open: undefined,
      filters: this.filtersFromGroups(props.config.groups),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEquals(this.props.config.groups, nextProps.groups)) {
      this.setState({ filters: this.fitlersFromGroups(nextProps.groups) });
    }
  }

  filtersFromGroups(groups) {
    return groups.map(() => () => true);
  }

  filterInput() {
    const { filters } = this.state;
    const { config, input, onInputFilter } = this.props;

    onInputFilter(input.filter(row =>
      config.groups.every((g, i) =>
        filters[i](g.selector(row))
      )
    ));
  }

  handleFilter = i => (f) => {
    const { filters } = this.state;

    const newFilters = filters.map((v, idx) => {
      if (idx !== i) return v;
      return f;
    });

    this.setState({ filters: newFilters }, this.filterInput);
  }

  handleOpen = i => (e) => {
    e.stopPropagation();
    this.setState({ open: i });
  }

  close = () => this.setState({ open: undefined })

  toggleSort(v) {
    if (v === 'asc') return 'desc';
    return 'asc';
  }

  toggle = (sorts, i) =>
    sorts.map((v, idx) => {
      if (idx !== i) return v;
      return this.toggleSort(v);
    });

  updateGroupSorts = (i) => {
    const { config } = this.props;
    const { groupSorts, groups } = config;

    if (!groupSorts) {
      this.props.onGroupSorts(range(0, groups.length).map(() => 'asc'));
    } else {
      this.props.onGroupSorts(this.toggle(groupSorts, i));
    }
  }

  render() {
    const { input, width, height, config } = this.props;
    const { open } = this.state;
    const { groupSorts, groups } = config;

    return (
      <th colSpan={width} rowSpan={height} className="group-header header-controls">
        {groups.map((group, i) => {
          const sort = (groupSorts || [])[i];
          const filterOpen = open === i;
          const values = Object.keys(
            input.map(group.selector).reduce((acc, v) => ({ ...acc, [v]: true }), {})
          ).sort();

          return (
            <span key={group.name}>
              <div className="btn-group">
                <button
                  className="btn btn-default"
                  onClick={() => this.updateGroupSorts(i)}
                >
                  <span
                    className={`sorter ${sort ? `sort-${sort}` : ''}`}
                  >
                    {group.name}
                  </span>
                </button>
                <button
                  className="btn btn-default"
                  onClick={this.handleOpen(i)}
                >
                  <i className="fa fa-filter" />
                </button>
              </div>
              <FilterMenu
                show={filterOpen}
                onRequestClose={this.close}
                data={values}
                onFilter={this.handleFilter(i)}
              />
            </span>
          );
        })}
      </th>
    );
  }
}

