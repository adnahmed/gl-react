"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Node = _interopRequireDefault(require("./Node"));
var _invariantNoDependentsLoop = _interopRequireDefault(require("./helpers/invariantNoDependentsLoop"));
var _genId = _interopRequireDefault(require("./genId"));
var _GLContext = _interopRequireDefault(require("./GLContext"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * a **Bus is a container to "cache" and re-use content** (tree of Node, canvas, video,...) somewhere else in your GL graph.
 * To use it, use the Bus `ref`:
 * - provide it in another Node texture uniform so you can share computation (send a Node texture to multiple Nodes dependent) (more exactly, a working pattern is to give a `()=>ref` function that will be resolved in `DidUpdate` lifecycle)
 * - You have a `capture()` method to snapshot the underlying Node (because Node can be hidden being nested React components).
 *
 *
 * @prop {any} children the content to render. It can also be a function that takes a redraw function and render an element.
 * @prop {string} [uniform] In case you want to explicitely draw Bus directly into a uniform, you can give the uniform name of the parent node.
 * If this prop is not used, the Bus does not directly belong to a Node and a ref can be used to indirectly give a texture to a node.
 * `uniform` is equivalent to directly pass your VDOM inside the Node uniforms prop.
 *
 * **Usage Example**
 *
 * [![](https://github.com/ProjectSeptemberInc/gl-react/raw/master/docs/examples/blur.gif)](/blurmapmouse)
 *
 * @example
 *
 * <Surface ...>
 *   <Bus ref="myBus">
 *     //here, glEffects or content like a canvas/video...
 *   </Bus>
 *   <Node uniforms={{
 *     texture: () => this.refs.myBus
 *   }} ... />
 * </Surface>
 *
 */
class Bus extends _react.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "id", (0, _genId.default)());
    _defineProperty(this, "context", void 0);
    _defineProperty(this, "dependents", []);
    _defineProperty(this, "glNode", null);
    _defineProperty(this, "glBusRootNode", void 0);
    _defineProperty(this, "onRef", ref => {
      this.glBusRootNode = ref;
    });
    /**
     * Schedule a redraw of all nodes that depends on this Bus.
     *
     * @function
     */
    _defineProperty(this, "redraw", () => {
      this.dependents.forEach(d => d.redraw());
    });
    _defineProperty(this, "_draw", () => {
      // FIXME: _draw() on a Bus? (would a third party need this?)
    });
  }
  componentDidMount() {
    const {
      uniform,
      index
    } = this.props;
    if (uniform) {
      const {
        glParent
      } = this.context;
      (0, _invariant.default)(glParent instanceof _Node.default, 'a <Bus uniform=".." /> needs to be inside a Node');
      glParent._addUniformBus(this, uniform, index);
    }
    this.redraw();
  }
  componentWillUnmount() {
    const {
      uniform,
      index
    } = this.props;
    if (uniform) {
      const {
        glParent
      } = this.context;
      (0, _invariant.default)(glParent instanceof _Node.default, 'a <Bus uniform=".." /> needs to be inside a Node');
      glParent._removeUniformBus(this, uniform, index);
    }
  }
  componentDidUpdate({
    uniform: oldUniform,
    index: oldIndex
  }) {
    const {
      uniform,
      index
    } = this.props;
    if (uniform && (uniform !== oldUniform || index !== oldIndex)) {
      const {
        glParent
      } = this.context;
      (0, _invariant.default)(glParent instanceof _Node.default, 'a <Bus uniform=".." /> needs to be inside a Node');
      if (oldUniform) glParent._removeUniformBus(this, oldUniform, oldIndex);
      glParent._addUniformBus(this, uniform, index);
    }
    this.redraw();
  }
  _addGLNodeChild(node) {
    this.glNode = node;
    this.context.glParent.redraw();
  }
  _removeGLNodeChild(node) {
    this.glNode = null;
  }
  _addDependent(node) {
    const i = this.dependents.indexOf(node);
    if (i === -1) {
      (0, _invariantNoDependentsLoop.default)(this, node);
      this.dependents.push(node);
    }
  }
  _removeDependent(node) {
    const i = this.dependents.indexOf(node);
    if (i !== -1) this.dependents.splice(i, 1);
  }
  getGLRenderableNode() {
    return this.glNode;
  }
  getGLRenderableContent() {
    const {
      mapRenderableContent
    } = this.context.glSurface;
    const {
      glBusRootNode
    } = this;
    return glBusRootNode && mapRenderableContent ? mapRenderableContent(glBusRootNode) : null;
  }
  getGLName() {
    return `Bus(${this.glNode ? this.glNode.getGLName() : String(this.getGLRenderableContent())})`;
  }
  getGLShortName() {
    const content = this.getGLRenderableContent();
    const shortContentName = String(content && content.constructor && content.constructor.name || content);
    return `Bus(${this.glNode ? this.glNode.getGLShortName() : shortContentName})`;
  }

  /**
   * Capture the underlying Node pixels.
   * NB it only works for nodes, not for content like video/canvas.
   */
  capture(x, y, w, h) {
    (0, _invariant.default)(this.glNode, "Bus does not contain any Node");
    return this.glNode.capture(x, y, w, h);
  }
  _onContextLost() {
    const {
      glNode
    } = this;
    if (glNode) glNode._onContextLost();
  }
  _onContextRestored(gl) {
    const {
      glNode
    } = this;
    if (glNode) glNode._onContextRestored(gl);
  }
  render() {
    const {
      children
    } = this.props;
    const {
      glSurface: {
        RenderLessElement,
        mapRenderableContent
      }
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_GLContext.default.Provider, {
      value: {
        glParent: this,
        glSurface: this.context.glSurface,
        glSizable: this.context.glSizable
      }
    }, /*#__PURE__*/_react.default.createElement(RenderLessElement, {
      ref: mapRenderableContent ? this.onRef : undefined
    }, typeof children === "function" ? children(this.redraw) : children));
  }
}
exports.default = Bus;
_defineProperty(Bus, "contextType", _GLContext.default);
_defineProperty(Bus, "defaultProps", {
  index: 0
});
//# sourceMappingURL=Bus.js.map