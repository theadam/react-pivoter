/* eslint-disable import/no-extraneous-dependencies */
import React, { Component, PropTypes } from 'react';
import onClickOutside from 'react-onclickoutside';

export function shallowEquals(a, b) {
  return a.every((g, i) => g === b[i]);
}

@onClickOutside
export default class FilterMenu extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    const selected = this.selectedFromProps(props.data);

    this.state = {
      text: '',
      selected,
      lastText: '',
      lastSelected: selected,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEquals(nextProps.data, this.props.data)) {
      this.setState({ selected: this.selectedFromProps(nextProps.data) });
    }
    if (nextProps.show === true && this.props.show === false) {
      this.setState({ lastText: this.state.text, lastSelected: this.state.selected });
    }
  }

  selectedFromProps(data) {
    return data.reduce((acc, v) => ({ ...acc, [v]: true }), {});
  }

  textFilter = () => {
    const { text } = this.state;
    if (text === '') return () => true;
    return v => v.toLowerCase().indexOf(text.toLowerCase()) !== -1;
  }

  fullFilter = () => {
    const text = this.textFilter();
    const selected = this.state.selected;
    return v => selected[v] && text(v);
  }

  cancel = () => {
    this.setState({
      text: this.state.lastText,
      selected: this.state.lastSelected,
    });
    this.props.onRequestClose();
  }

  ok = () => {
    this.props.onFilter(this.fullFilter());
    this.props.onRequestClose();
  }

  handleClickOutside = () => this.props.show && this.cancel();
  handleTextChange = e => this.setState({ text: e.target.value });
  handleCheckChange = v => () => {
    const { selected } = this.state;
    this.setState({
      selected: { ...selected, [v]: !selected[v] },
    });
  }

  handleShowAll = () => {
    const { selected } = this.state;
    const value = !this.allChecked();
    this.setState({
      selected: Object.keys(selected).reduce((acc, k) => (
        { ...acc, [k]: value }
      ), {}),
    });
  };

  allChecked = () => {
    const { selected } = this.state;
    return Object.values(selected).every(v => v);
  }

  render() {
    const { text, selected } = this.state;
    const { show, data } = this.props;
    const showClass = show ? '' : 'hide';

    return (
      <div className={`filter-menu ${showClass}`}>
        <div className="header">
          <input className="form-control" value={text} onChange={this.handleTextChange} />
        </div>
        <div className="body">
          { text === '' &&
            <label htmlFor="show-all-input">
              <input
                id="show-all-input"
                type="checkbox"
                checked={this.allChecked()}
                onChange={this.handleShowAll}
              />
              (Show All)
            </label>
          }
          {data.filter(this.textFilter()).map(v =>
            <label htmlFor={v} key={v}>
              <input
                id={v}
                type="checkbox"
                checked={selected[v]}
                onChange={this.handleCheckChange(v)}
              />
              {v}
            </label>
          )}
        </div>
        <div className="footer text-center">
          <button className="btn btn-default" onClick={this.ok}>Ok</button>
          <button className="btn btn-default" onClick={this.cancel}>Cancel</button>
        </div>
      </div>
    );
  }
}
