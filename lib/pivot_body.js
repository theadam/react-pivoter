'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PivotBody = (_temp2 = _class = function (_Component) {
  _inherits(PivotBody, _Component);

  function PivotBody() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PivotBody);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PivotBody.__proto__ || Object.getPrototypeOf(PivotBody)).call.apply(_ref, [this].concat(args))), _this), _this.isShowing = function (row) {
      return _this.isOpen(row.path.slice(0, -1));
    }, _this.isOpen = function (path) {
      if (path.length === 0) return true;
      return (0, _utils.isOpen)(path, _this.props.opens);
    }, _this.handleGroupClick = function (row) {
      return function () {
        if (row.subGroups) {
          _this.props.onToggleOpen(row.path);
        }
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PivotBody, [{
    key: 'getCellClassName',
    value: function getCellClassName(col) {
      return [col.groupStart && col.path.length > 0 && 'group-start', 'data'].filter(function (v) {
        return !!v;
      }).join(' ');
    }
  }, {
    key: 'getGroupClassName',
    value: function getGroupClassName(row) {
      var hasSubGroups = !!row.subGroups;
      return [hasSubGroups && this.isOpen(row.path) && 'open', hasSubGroups && !this.isOpen(row.path) && 'closed', 'group'].filter(function (v) {
        return !!v;
      }).join(' ');
    }
  }, {
    key: 'renderGroup',
    value: function renderGroup(row) {
      var _props = this.props,
          groups = _props.groups,
          renderGroup = _props.renderGroup;

      var group = groups[row.level];
      var text = (group.formatter || function (x) {
        return x;
      })((0, _utils.last)(row.path, row));

      return renderGroup(text, group, row);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          flattened = _props2.flattened,
          dataGetter = _props2.dataGetter,
          renderCell = _props2.renderCell,
          maxOpen = _props2.maxOpen;


      return _react2.default.createElement(
        'tbody',
        null,
        flattened.filter(this.isShowing).map(function (row) {
          return _react2.default.createElement(
            'tr',
            { key: Object.values(row.projection).join('#') + '#' + row.level },
            row.path.slice(0, -1).map(function (v, i) {
              return _react2.default.createElement('td', { className: 'before-group', key: i });
            }),
            _react2.default.createElement(
              'td',
              {
                onClick: _this2.handleGroupClick(row),
                className: _this2.getGroupClassName(row)
              },
              _this2.renderGroup(row)
            ),
            (0, _utils.range)(0, maxOpen - row.level - 1).map(function (v, i) {
              return _react2.default.createElement('td', {
                onClick: _this2.handleGroupClick(row),
                className: 'after-group', key: i
              });
            }),
            dataGetter(row.data).map(function (_ref2) {
              var col = _ref2.col,
                  data = _ref2.data;
              return _react2.default.createElement(
                'td',
                {
                  key: col.path.join('#'),
                  className: _this2.getCellClassName(col)
                },
                renderCell(col.format(data, col, row), col, row)
              );
            })
          );
        })
      );
    }
  }]);

  return PivotBody;
}(_react.Component), _class.propTypes = {
  dataGetter: _react.PropTypes.func.isRequired,
  flattened: _react.PropTypes.array.isRequired,
  renderCell: _react.PropTypes.func,
  renderGroup: _react.PropTypes.func,
  opens: _react.PropTypes.object.isRequired,
  maxOpen: _react.PropTypes.number.isRequired,
  onToggleOpen: _react.PropTypes.func.isRequired,
  groups: _react.PropTypes.array.isRequired
}, _class.defaultProps = {
  renderCell: function renderCell(data) {
    return data;
  },
  renderGroup: function renderGroup(group) {
    return group;
  }
}, _temp2);
exports.default = PivotBody;