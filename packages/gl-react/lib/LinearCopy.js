"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Node = _interopRequireDefault(require("./Node"));
var _copyShader = _interopRequireDefault(require("./copyShader"));
const _excluded = ["children"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * copy pixel with a linear interpolation
 * @prop {any} children content to render
 */
class LinearCopy extends _react.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "_node", void 0);
    _defineProperty(this, "_onRef", node => {
      this._node = node;
    });
  }
  /**
   * get a reference to the underlying Node instance
   * @return {Node}
   */
  getNodeRef() {
    return this._node;
  }
  render() {
    const _this$props = this.props,
      {
        children: t
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    return /*#__PURE__*/_react.default.createElement(_Node.default, _extends({}, rest, {
      ref: this._onRef,
      shader: _copyShader.default,
      blendFunc: {
        src: "one",
        dst: "one minus src alpha"
      },
      uniformsOptions: {
        t: {
          interpolation: "linear"
        }
      },
      uniforms: {
        t
      }
    }));
  }
}
var _default = exports.default = LinearCopy;
//# sourceMappingURL=LinearCopy.js.map