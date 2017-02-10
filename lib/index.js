'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PivotTable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _open_controller = require('./open_controller');

var _open_controller2 = _interopRequireDefault(_open_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PivotTable(props) {
  var renderHeader = props.renderHeader,
      renderCell = props.renderCell,
      renderGroup = props.renderGroup,
      renderGroupHeaders = props.renderGroupHeaders,
      totalText = props.totalText,
      renderTotalGroup = props.renderTotalGroup,
      renderTotalCell = props.renderTotalCell,
      config = props.config,
      data = props.data,
      className = props.className;

  var columns = (0, _utils.columnTree)(data, config);
  var dataGetter = (0, _utils.dataGetterFrom)(columns);

  return _react2.default.createElement(_open_controller2.default, {
    data: data,
    config: config,
    renderHeader: renderHeader,
    renderCell: renderCell,
    renderGroup: renderGroup,
    renderTotalCell: renderTotalCell,
    renderTotalGroup: renderTotalGroup,
    renderGroupHeaders: renderGroupHeaders,
    className: className,
    totalText: totalText,
    columnTree: columns,
    dataGetter: dataGetter
  });
}

PivotTable.propTypes = {
  data: _react.PropTypes.object.isRequired,
  config: _react.PropTypes.object.isRequired,
  renderHeader: _react.PropTypes.func,
  renderCell: _react.PropTypes.func,
  renderGroup: _react.PropTypes.func,
  renderTotalCell: _react.PropTypes.func,
  renderTotalGroup: _react.PropTypes.func,
  renderGroupHeaders: _react.PropTypes.func,
  className: _react.PropTypes.string,
  totalText: _react.PropTypes.string
};