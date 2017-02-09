import React, { Component, PropTypes } from 'react';

export default class Modal extends Component {
  static propTypes = {
    data: PropTypes.array,
    row: PropTypes.object,
    col: PropTypes.object,
    columns: PropTypes.array.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  }

  handleClick = (e) => {
    if (e.target !== this.modal) return;
    this.props.onRequestClose();
  }

  render() {
    const { data, columns, col, row, onRequestClose } = this.props;
    if (!data) return false;

    return (
      <div>
        <div className="modal show" ref={c => (this.modal = c)} onClick={this.handleClick}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={onRequestClose}>
                  x
                </button>
                <h3>
                  {row.path ? row.path.join(' - ') : 'Total'}
                </h3>
                <h4>
                  {col.path.join(' - ')}
                </h4>
              </div>
              <div className="modal-body">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      {columns.map(({ name }) =>
                        <th key={name}>{name}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((r, i) =>
                      <tr key={i}>
                        {columns.map(({ name, selector }) =>
                          <td key={name}>{selector(r)}</td>
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop in" />
      </div>
    );
  }
}
