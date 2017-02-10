'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PivotTotal = (_temp = _class = function (_Component) {
  _inherits(PivotTotal, _Component);

  function PivotTotal() {
    _classCallCheck(this, PivotTotal);

    return _possibleConstructorReturn(this, (PivotTotal.__proto__ || Object.getPrototypeOf(PivotTotal)).apply(this, arguments));
  }

  _createClass(PivotTotal, [{
    key: 'getCellClassName',
    value: function getCellClassName(col) {
      return [col.groupStart && col.path.length > 0 && 'group-start', 'total-data'].filter(function (v) {
        return !!v;
      }).join(' ');
    }
  }, {
    key: 'renderGroup',
    value: function renderGroup() {
      var _props = this.props,
          totalText = _props.totalText,
          maxOpen = _props.maxOpen,
          total = _props.total,
          renderTotalGroup = _props.renderTotalGroup;


      return _react2.default.createElement(
        'td',
        {
          colSpan: maxOpen,
          className: 'total-group'
        },
        renderTotalGroup(totalText, total)
      );
    }
  }, {
    key: 'renderCells',
    value: function renderCells() {
      var _this2 = this;

      var _props2 = this.props,
          total = _props2.total,
          dataGetter = _props2.dataGetter,
          renderTotalCell = _props2.renderTotalCell;


      return dataGetter(total.data).map(function (_ref) {
        var col = _ref.col,
            data = _ref.data;
        return _react2.default.createElement(
          'td',
          {
            key: col.path.join('#'),
            className: _this2.getCellClassName(col)
          },
          renderTotalCell(col.format(data, col, total), col, total)
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'tfoot',
        null,
        _react2.default.createElement(
          'tr',
          null,
          this.renderGroup(),
          this.renderCells()
        )
      );
    }
  }]);

  return PivotTotal;
}(_react.Component), _class.propTypes = {
  totalText: _react.PropTypes.string,
  total: _react.PropTypes.object.isRequired,
  dataGetter: _react.PropTypes.func.isRequired,
  renderTotalGroup: _react.PropTypes.func,
  renderTotalCell: _react.PropTypes.func,
  maxOpen: _react.PropTypes.number.isRequired
}, _class.defaultProps = {
  renderTotalGroup: function renderTotalGroup(text) {
    return text;
  },
  renderTotalCell: function renderTotalCell(text) {
    return text;
  },
  totalText: 'Total'
}, _temp);
exports.default = PivotTotal;