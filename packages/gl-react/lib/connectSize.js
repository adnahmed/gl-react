"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _GLContext = _interopRequireDefault(require("./GLContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * A High Order Component (HOC) function that provides
 * the contextual `width` and `height` props to a GL Component.
 * It also merge optional width,height props to override the contextual size
 * @function connectSize
 * @param GLComponent - a React Component that receives width and height props
 * @returns {ReactClass<*>} a Component that merge width and height props
 * with context and renders `GLComponent`.
 * @example
 *  const Foo = ({ width, height }) => <Node uniforms={{ width, height }} />;
 *  const FooConnected = connectSize(Foo);
 *  <FooConnected /> // you don't have to provide width, height.
 *  <FooConnected width={64} height={64} /> // If you do, you override width,height in the context as well, so <Node> is implicitly receiving the new width/height.
 */
const connectSize = GLComponent => {
  var _Class;
  return _Class = class extends _react.Component {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "context", void 0);
    }
    getGLSize() {
      const {
        props: {
          width,
          height
        },
        context: {
          glSizable
        }
      } = this;
      if (width && height) return [width, height];
      const [cw, ch] = glSizable.getGLSize();
      return [width || cw, height || ch];
    }
    render() {
      const {
        onConnectSizeComponentRef
      } = this.props;
      const [width, height] = this.getGLSize();
      return /*#__PURE__*/_react.default.createElement(_GLContext.default.Provider, {
        value: {
          glSizable: this,
          glParent: this.context.glParent,
          glSurface: this.context.glSurface
        }
      }, /*#__PURE__*/_react.default.createElement(GLComponent, _extends({
        ref: onConnectSizeComponentRef
      }, this.props, {
        width: width,
        height: height
      })));
    }
  }, _defineProperty(_Class, "displayName", `connectSize(${GLComponent.displayName || GLComponent.name || "?"})`), _defineProperty(_Class, "propTypes", {
    width: _propTypes.default.number,
    height: _propTypes.default.number
  }), _defineProperty(_Class, "contextType", _GLContext.default), _Class;
};
var _default = exports.default = connectSize;
//# sourceMappingURL=connectSize.js.map