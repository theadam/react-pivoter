'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _pivot_header = require('./pivot_header');

var _pivot_header2 = _interopRequireDefault(_pivot_header);

var _pivot_body = require('./pivot_body');

var _pivot_body2 = _interopRequireDefault(_pivot_body);

var _pivot_total = require('./pivot_total');

var _pivot_total2 = _interopRequireDefault(_pivot_total);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OpenController = (_temp = _class = function (_Component) {
  _inherits(OpenController, _Component);

  function OpenController(props) {
    _classCallCheck(this, OpenController);

    var _this = _possibleConstructorReturn(this, (OpenController.__proto__ || Object.getPrototypeOf(OpenController)).call(this, props));

    _this.handleOpen = function (path) {
      _this.setState({ opens: (0, _utils.updateOpens)(_this.state.opens, path) });
    };

    _this.state = {
      opens: {}
    };
    return _this;
  }

  _createClass(OpenController, [{
    key: 'render',
    value: function render() {
      var opens = this.state.opens;
      var _props = this.props,
          renderHeader = _props.renderHeader,
          renderCell = _props.renderCell,
          renderGroup = _props.renderGroup,
          renderGroupHeaders = _props.renderGroupHeaders,
          totalText = _props.totalText,
          renderTotalGroup = _props.renderTotalGroup,
          renderTotalCell = _props.renderTotalCell,
          config = _props.config,
          data = _props.data,
          columnTree = _props.columnTree,
          dataGetter = _props.dataGetter;
      var groups = config.groups;

      var openMax = (0, _utils.maxOpen)(opens);

      return _react2.default.createElement(
        'table',
        { className: this.props.className },
        _react2.default.createElement(_pivot_header2.default, {
          columnTree: columnTree,
          renderHeader: renderHeader,
          renderGroupHeaders: renderGroupHeaders,
          maxOpen: openMax,
          groups: groups
        }),
        _react2.default.createElement(_pivot_body2.default, {
          flattened: data.flattened,
          dataGetter: dataGetter,
          renderCell: renderCell,
          renderGroup: renderGroup,
          opens: opens,
          maxOpen: openMax,
          onToggleOpen: this.handleOpen,
          groups: groups
        }),
        _react2.default.createElement(_pivot_total2.default, {
          totalText: totalText,
          total: data.total,
          dataGetter: dataGetter,
          renderTotalGroup: renderTotalGroup,
          renderTotalCell: renderTotalCell,
          maxOpen: openMax
        })
      );
    }
  }]);

  return OpenController;
}(_react.Component), _class.propTypes = {
  data: _react.PropTypes.object.isRequired,
  config: _react.PropTypes.object.isRequired,
  renderHeader: _react.PropTypes.func,
  renderCell: _react.PropTypes.func,
  renderGroup: _react.PropTypes.func,
  renderTotalCell: _react.PropTypes.func,
  renderTotalGroup: _react.PropTypes.func,
  renderGroupHeaders: _react.PropTypes.func,
  className: _react.PropTypes.string,
  totalText: _react.PropTypes.string,
  columnTree: _react.PropTypes.array.isRequired,
  dataGetter: _react.PropTypes.func.isRequired
}, _temp);
exports.default = OpenController;