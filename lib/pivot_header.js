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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PivotHeader = (_temp = _class = function (_Component) {
  _inherits(PivotHeader, _Component);

  function PivotHeader() {
    _classCallCheck(this, PivotHeader);

    return _possibleConstructorReturn(this, (PivotHeader.__proto__ || Object.getPrototypeOf(PivotHeader)).apply(this, arguments));
  }

  _createClass(PivotHeader, [{
    key: 'renderGroupHeaders',
    value: function renderGroupHeaders() {
      var _props = this.props,
          columnTree = _props.columnTree,
          maxOpen = _props.maxOpen,
          groups = _props.groups,
          renderGroupHeaders = _props.renderGroupHeaders;


      return renderGroupHeaders(groups, maxOpen, columnTree.length);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          columnTree = _props2.columnTree,
          renderHeader = _props2.renderHeader;


      return _react2.default.createElement(
        'thead',
        null,
        columnTree.map(function (row, i) {
          return _react2.default.createElement(
            'tr',
            { key: i },
            i === 0 && _this2.renderGroupHeaders(),
            row.map(function (col) {
              return _react2.default.createElement(
                'th',
                {
                  rowSpan: col.rowSpan,
                  colSpan: col.colSpan,
                  key: col.path.join('#'),
                  className: PivotHeader.getClassName(col)
                },
                renderHeader(col.headerFormat(col.text, col, row), col, row)
              );
            })
          );
        })
      );
    }
  }], [{
    key: 'getClassName',
    value: function getClassName(col) {
      return [col.groupStart && col.path.length > 0 && 'group-start', col.hasChildren && 'parent', col.leaf && 'leaf'].filter(function (v) {
        return !!v;
      }).join(' ');
    }
  }, {
    key: 'renderGroupHeaders',
    value: function renderGroupHeaders(groups, width, height) {
      return (0, _utils.range)(0, width).map(function (idx) {
        return groups[idx];
      }).map(function (group) {
        var format = group.headerFormatter || function (x) {
          return x;
        };

        return _react2.default.createElement(
          'th',
          {
            className: 'group-header',
            rowSpan: height,
            key: group.name
          },
          format(group.name, group)
        );
      });
    }
  }]);

  return PivotHeader;
}(_react.Component), _class.propTypes = {
  columnTree: _react.PropTypes.array.isRequired,
  renderHeader: _react.PropTypes.func,
  renderGroupHeaders: _react.PropTypes.func,
  maxOpen: _react.PropTypes.number.isRequired,
  groups: _react.PropTypes.array.isRequired
}, _class.defaultProps = {
  renderHeader: function renderHeader(text) {
    return text;
  },
  renderGroupHeaders: function renderGroupHeaders() {
    return PivotHeader.renderGroupHeaders.apply(PivotHeader, arguments);
  }
}, _temp);
exports.default = PivotHeader;