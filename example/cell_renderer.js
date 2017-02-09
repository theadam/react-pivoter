import React, { Component, PropTypes } from 'react';

export default class CellRenderer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
  }

  handleClick = (e) => {
    if (this.clicked) {
      clearTimeout(this.toid);
      this.clicked = false;
      this.props.onDoubleClick(e);
    } else {
      this.clicked = true;
      this.toid = setTimeout(() => {
        this.clicked = false;
      }, 500);
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div
        className="cell"
        onClick={this.handleClick}
      >
        {children}
      </div>
    );
  }
}
