"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _typedarrayPool = _interopRequireDefault(require("typedarray-pool"));
var _ndarray = _interopRequireDefault(require("ndarray"));
var _Uniform = _interopRequireDefault(require("./Uniform"));
var _Bus = _interopRequireDefault(require("./Bus"));
var _Shaders = _interopRequireWildcard(require("./Shaders"));
var _invariantNoDependentsLoop = _interopRequireDefault(require("./helpers/invariantNoDependentsLoop"));
var _genId = _interopRequireDefault(require("./genId"));
var _GLContext = _interopRequireDefault(require("./GLContext"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const blendFuncAliases = {
  zero: "ZERO",
  one: "ONE",
  "src color": "SRC_COLOR",
  "one minus src color": "ONE_MINUS_SRC_COLOR",
  "src alpha": "SRC_ALPHA",
  "one minus src alpha": "ONE_MINUS_SRC_ALPHA",
  "dst color": "DST_COLOR",
  "one minus dst color": "ONE_MINUS_DST_COLOR",
  "dst alpha": "DST_ALPHA",
  "one minus dst alpha": "ONE_MINUS_DST_ALPHA",
  "constant color": "CONSTANT_COLOR",
  "one minus constant color": "ONE_MINUS_CONSTANT_COLOR",
  "constant alpha": "CONSTANT_ALPHA",
  "one minus constant alpha": "ONE_MINUS_CONSTANT_ALPHA",
  "src alpha saturate": "SRC_ALPHA_SATURATE"
};

/**
 * The texture pixel interpolation mode.
 *
 * One of:
 * - `linear`
 * - `nearest`
 */

/**
 * A texture wrap mode define how the texture lookup repeat over edges.
 *
 * One of:
 * - `clamp to edge`
 * - `repeat`
 * - `mirrored repeat`
 */

/**
 * Options on a texture.
 * - interpolation define how the pixel lookup get mapped to screen.
 * - wrap define how the edge lookup behaves. It can be either a [x,y] wrap or a wrap value for both.
 */

/**
 * The GL blending function.
 *
 * One of:
 * - `zero`
 * - `one`
 * - `src color`
 * - `one minus src color`
 * - `src alpha`
 * - `one minus src alpha`
 * - `dst color`
 * - `one minus dst color`
 * - `dst alpha`
 * - `one minus dst alpha`
 * - `constant color`
 * - `one minus constant color`
 * - `constant alpha`
 * - `one minus constant alpha`
 * - `src alpha saturate`
 */

/**
 *
 */

/**
 * Array of 4 numbers. Useful to represent colors. *[ r, g, b, a ]*
 */

/**
 * The GL clear mode.
 */

/**
 * Uniforms is an map object from uniform name to a value.
 *
 * **The library support numerous uniform types via different formats.
 * Let's describe them:**
 *
 * ### int or float
 *
 * a JavaScript number
 *
 * ### bool
 *
 * a JavaScript Boolean
 *
 * ### int[], float[], bool[] arrays
 *
 * an array of the number (0/1 for bool can be used as well as bools)
 *
 * ### vec2, vec3, vec4
 *
 * an array of number, of size respectively 2, 3 and 4.
 *
 * > same is available for ivec* variants.
 *
 * ### mat2, mat3, mat4
 *
 * Similarly to vectorial types, you can pass an array of numbers.
 * For matrix, you actually define them in a flatten way (not arrays of arrays).
 *
 * ### sampler2D type (aka texture)
 *
 * The library support numerous and extensible uniform value format.
 *
 * **FIXME: to be documented.**
 *
 * ### struct types
 *
 * Consider it unsupported even though it *might* work since gl-react is based on `gl-shader`.
 *
 */

// not sure why, but we must define this for Flow to properly type check

const isBackbuffer = obj => {
  if (obj === "Backbuffer") {
    console.warn('Backbuffer is deprecated, use Uniform.Backbuffer instead: `import {Uniform} from "gl-react"`');
    return true;
  }
  return obj === _Uniform.default.Backbuffer;
};
const isBackbufferFrom = obj => obj && typeof obj === "object" && obj.type === "BackbufferFrom";
const isTextureSizeGetter = obj => obj && typeof obj === "object" && obj.type === "TextureSize";
const nodeWidthHeight = ({
  width,
  height
}, {
  glSizable
}) => {
  if (width && height) return [width, height];
  const [cw, ch] = glSizable.getGLSize();
  return [width || cw, height || ch];
};
const mapBlendFunc = (gl, name) => {
  // $FlowFixMe
  if (name in gl) return gl[name];
  if (name in blendFuncAliases) {
    const id = blendFuncAliases[name];
    // $FlowFixMe
    if (id in gl) return gl[id];
  }
  console.warn("Invalid blendFunc. Got:", name);
};
const parseWrap = (gl, w) => {
  switch (w) {
    case "clamp to edge":
      return gl.CLAMP_TO_EDGE;
    case "repeat":
      return gl.REPEAT;
    case "mirrored repeat":
      return gl.MIRRORED_REPEAT;
    default:
      console.warn("Invalid wrap. Got:", w);
      return gl.CLAMP_TO_EDGE;
  }
};
const mergeArrays = (a, b) => {
  const t = [];
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    t[i] = b[i] || a[i];
  }
  return t;
};
const parseInterpolation = (gl, i) => {
  switch (i) {
    case "linear":
      return gl.LINEAR;
    case "nearest":
      return gl.NEAREST;
    default:
      console.warn("Invalid interpolation. Got:", i);
      return gl.LINEAR;
  }
};
// minimal version of gl-fbo
const createFBO = (gl, width, height) => {
  var handle = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, handle);
  var color = gl.createTexture();
  if (!color) throw new Error("createTexture returned null");
  gl.bindTexture(gl.TEXTURE_2D, color);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color, 0);
  return {
    handle,
    color,
    bind: () => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, handle);
      gl.viewport(0, 0, width, height);
    },
    syncSize: (w, h) => {
      if (w !== width || h !== height) {
        width = w;
        height = h;
        gl.bindTexture(gl.TEXTURE_2D, color);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
    },
    dispose: () => {
      gl.deleteFramebuffer(handle);
      gl.deleteTexture(color);
    }
  };
};
const defaultTextureOptions = {
  interpolation: "linear",
  wrap: ["clamp to edge", "clamp to edge"]
};
const applyTextureOptions = (gl, partialOpts) => {
  const opts = _objectSpread(_objectSpread({}, defaultTextureOptions), partialOpts);
  let filter = parseInterpolation(gl, opts.interpolation);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  let wrapS, wrapT;
  if (Array.isArray(opts.wrap)) {
    if (opts.wrap.length !== 2) {
      console.warn("textureOptions wrap: should be an array of 2 values. Got:", opts.wrap);
      wrapS = wrapT = gl.CLAMP_TO_EDGE;
    } else {
      wrapS = parseWrap(gl, opts.wrap[0]);
      wrapT = parseWrap(gl, opts.wrap[1]);
    }
  } else {
    wrapS = wrapT = parseWrap(gl, opts.wrap);
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
};
const NodePropTypes = {
  shader: _propTypes.default.object.isRequired,
  uniformsOptions: _propTypes.default.object,
  uniforms: _propTypes.default.object,
  ignoreUnusedUniforms: _propTypes.default.any,
  sync: _propTypes.default.bool,
  width: _propTypes.default.number,
  height: _propTypes.default.number,
  children: _propTypes.default.any,
  backbuffering: _propTypes.default.bool,
  blendFunc: _propTypes.default.object,
  clear: _propTypes.default.object,
  onDraw: _propTypes.default.func
};

/**
 * `<Node>` is the primitive that renders a shader program into a Framebuffer.
 * It can be composed with other `Node` via using a sampler2D uniforms.
 *
 * @prop {ShaderIdentifier} shader - created with `Shaders.create`
 * @prop {Uniforms} [uniforms] - uniform values that gets passed to the fragment shader.
 * @prop {Object} [uniformsOptions] - allows to configure things like interpolation of a sampler2D texture.
 * @prop {number} [width] - the width in in real pixels unit (unlike Surface, no pixel ratio)
 * @prop {number} [height] - the height in in real pixels unit (unlike Surface, no pixel ratio)
 * @prop {bool} [sync] - If true, a React update will always force a sync redraw of the Node framebuffer.
 * @prop {bool} [backbuffering] - enable the backbuffering that allows to use `Backbuffer` in uniforms to get the previous framebuffer texture state in the fragment shader.
 * @prop {BlendFuncSrcDst} [blendFunc] - configure the blending function to use
 * @prop {Clear} [clear] - configure the clear to use (color,...)
 * @prop {Function} [onDraw] - a callback called each time a draw was produced for this Node.
 * @prop {any} [children] - in advanced use-cases, you can render things like Bus or contents to be used by Node
 * @prop {any} [ignoreUnusedUniforms] - ignore all or some uniforms to be warned if they are not existing or used in the actual shader code (by default it's good for dev to warn them but they are usecase where it's not easy to know, like if the GLSL code come from the user). boolean to ignore all or whitelist array of uniforms name to ignore.
 * @example
 *  <Node shader={shaders.helloGL} />
 */
class Node extends _react.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "drawProps", this.props);
    _defineProperty(this, "context", void 0);
    _defineProperty(this, "framebuffer", void 0);
    _defineProperty(this, "backbuffer", void 0);
    _defineProperty(this, "_needsRedraw", false);
    _defineProperty(this, "capturePixelsArray", void 0);
    _defineProperty(this, "id", (0, _genId.default)());
    _defineProperty(this, "uniformsBus", {});
    _defineProperty(this, "dependencies", []);
    // Node this instance depends on
    _defineProperty(this, "dependents", []);
    _defineProperty(this, "_resolveElement", (uniform, value, index) => {
      if (! /*#__PURE__*/_react.default.isValidElement(value)) {
        if (typeof value === "function") {
          value = value(this.redraw);
          if (! /*#__PURE__*/_react.default.isValidElement(value)) {
            return; // the function don't return an Element, skip
          }
        } else {
          return; // the value isn't an Element, skip
        }
      }
      return /*#__PURE__*/_react.default.createElement(_Bus.default, {
        key: uniform + (index ? "." + index : ""),
        uniform: uniform,
        index: index
      }, value);
    });
    _defineProperty(this, "_renderUniformElement", key => {
      const {
        uniforms
      } = this.props;
      let value = uniforms[key];
      return Array.isArray(value) ? value.map((v, i) => this._resolveElement(key, v, i)) : this._resolveElement(key, value, 0);
    });
    /**
     * Schedule a redraw of this node and all dependent nodes.
     *
     * @function
     */
    _defineProperty(this, "redraw", () => {
      if (!this._needsRedraw) {
        this._needsRedraw = true;
        this.dependents.forEach(d => d.redraw());
      }
    });
    /**
     * Force the redraw (if any) to happen now, synchronously.
     *
     * @function
     */
    _defineProperty(this, "flush", () => {
      this.context.glSurface._draw();
    });
    _defineProperty(this, "_latestShaderInfo", void 0);
    _defineProperty(this, "_shader", void 0);
  }
  componentDidMount() {
    const {
      glSurface: {
        gl
      }
    } = this.context;
    if (gl) this._prepareGLObjects(gl);
    this.context.glParent._addGLNodeChild(this);
    this.redraw();
    if (this.props.sync) this.flush();
  }
  componentWillUnmount() {
    const {
      capturePixelsArray
    } = this;
    this._destroyGLObjects();
    if (capturePixelsArray) {
      _typedarrayPool.default.freeUint8(capturePixelsArray);
    }
    this._needsRedraw = false;
    this.context.glParent._removeGLNodeChild(this);
    this.dependencies.forEach(d => d._removeDependent(this));
  }
  _syncNextDrawProps(nextProps, nextContext) {
    const nextWidthHeight = nodeWidthHeight(nextProps, nextContext);
    if (this.framebuffer) {
      this.framebuffer.syncSize(...nextWidthHeight);
    }
    if (this.backbuffer) {
      this.backbuffer.syncSize(...nextWidthHeight);
    }
    (0, _invariant.default)(nextProps.backbuffering === this.drawProps.backbuffering, "Node backbuffering prop must not changed. (not yet supported)");
    this.drawProps = nextProps;
  }
  render() {
    const {
      children,
      uniforms
    } = this.props;
    const {
      glSurface: {
        RenderLessElement
      }
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_GLContext.default.Provider, {
      value: {
        glParent: this,
        glSurface: this.context.glSurface,
        glSizable: this
      }
    }, /*#__PURE__*/_react.default.createElement(RenderLessElement, null, children, Object.keys(uniforms).map(this._renderUniformElement)));
  }
  componentDidUpdate() {
    this._syncNextDrawProps(this.props, this.context);
    this.redraw();
    if (this.props.sync) this.flush();
  }
  getGLShortName() {
    const {
      shader
    } = this.drawProps;
    const shaderName = (0, _Shaders.isShaderIdentifier)(shader) ?
    // $FlowFixMe FIXME
    _Shaders.default.getShortName(shader) : "<inline>";
    return `Node(${shaderName})`;
  }
  getGLName() {
    const {
      shader
    } = this.drawProps;
    const shaderName = (0, _Shaders.isShaderIdentifier)(shader) ?
    // $FlowFixMe FIXME
    _Shaders.default.getName(shader) : "<inline>";
    return `Node#${this.id}(${shaderName})`;
  }
  getGLSize() {
    return nodeWidthHeight(this.drawProps, this.context);
  }
  getGLOutput() {
    const {
      framebuffer
    } = this;
    (0, _invariant.default)(framebuffer, "Node#getGLOutput: framebuffer is not defined. It cannot be called on a root Node");
    return framebuffer.color;
  }
  getGLBackbufferOutput() {
    const {
      backbuffer
    } = this;
    (0, _invariant.default)(backbuffer, "Node#getGLBackbufferOutput: backbuffer is not defined. Make sure `backbuffering` prop is defined");
    return backbuffer.color;
  }

  /**
   * Imperatively set the props with a partial subset of props to apply.
   * This is an escape hatch to perform a redraw with different props without having to trigger a new React draw. Only use it when reaching a performance bottleneck.
   * NB: at any time, render() needs to consistently render the same props you set in setDrawProps to avoid any potential blink (if a React draw would occur).
   * @param {Props} patch a subset of props to apply on top of the previous draw props.
   */
  setDrawProps(patch) {
    // $FlowFixMe
    const nextProps = _objectSpread(_objectSpread({}, this.drawProps), patch);
    this._syncNextDrawProps(nextProps, this.context);
    this.redraw();
    if (nextProps.sync) this.flush();
  }

  /**
   * Capture the node pixels.
   * Without parameters, it will capture the full rectangle,
   * otherwise you can provide (x, y) or (x, y, w, h) to provide a subset of this rectangle.
   */
  capture(x, y, w, h) {
    const [width, height] = this.getGLSize();
    const {
      gl
    } = this.context.glSurface;
    (0, _invariant.default)(gl, "gl is no longer available");
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;
    if (w === undefined) w = width - x;
    if (h === undefined) h = height - y;
    (0, _invariant.default)(x >= 0 && x + w <= width && y >= 0 && y + h <= height, "capture(%s,%s,%s,%s): requested rectangle is out of bounds (%s,%s)", x, y, w, h, width, height);
    const size = w * h * 4;
    const pixels = this._captureAlloc(size);
    this._bind();
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return (0, _ndarray.default)(pixels, [h, w, 4]).step(-1, 1, 1).transpose(1, 0, 2);
  }
  _destroyGLObjects() {
    const {
      glSurface
    } = this.context;
    if (glSurface.glIsAvailable()) {
      // We should only dispose() if gl is still here.
      // otherwise, GL should already have free resources.
      // (also workaround for https://github.com/stackgl/headless-gl/issues/90)
      const {
        framebuffer,
        backbuffer,
        _shader
      } = this;
      if (_shader) {
        _shader.dispose();
      }
      if (framebuffer) {
        framebuffer.dispose();
      }
      if (backbuffer) {
        backbuffer.dispose();
      }
    }
    delete this._shader;
    delete this.framebuffer;
    delete this.backbuffer;
  }
  _prepareGLObjects(gl) {
    const [width, height] = this.getGLSize();
    const {
      glParent,
      glSurface
    } = this.context;
    if (glParent === glSurface) {
      // my parent IS the glSurface, should prevent from creating a FBO.
      // when a FBO is not created, _draw() happens on the final Canvas (null fbo)
      // NB we can just do this in WillMount because this context will not change.
      (0, _invariant.default)(!this.drawProps.backbuffering, "`backbuffering` is currently not supported for a Root Node. " + "Try to wrap %s in a <LinearCopy> or <NearestCopy>.", this.getGLName());
    } else {
      const fbo = createFBO(gl, width, height);
      this.framebuffer = fbo;
      if (this.drawProps.backbuffering) {
        const fbo = createFBO(gl, width, height);
        this.backbuffer = fbo;
      }
    }
  }
  _onContextLost() {
    this.dependencies.forEach(d => d._onContextLost());
    this._destroyGLObjects();
  }
  _onContextRestored(gl) {
    this._prepareGLObjects(gl);
    this.dependencies.forEach(d => d._onContextRestored(gl));
    this._needsRedraw = true;
  }
  _addGLNodeChild(node) {}
  _removeGLNodeChild(node) {}
  _addUniformBus(uniformBus, uniformName, index) {
    const array = this.uniformsBus[uniformName] || (this.uniformsBus[uniformName] = []);
    array[index] = uniformBus;
  }
  _removeUniformBus(uniformBus, uniformName, index) {
    const array = this.uniformsBus[uniformName] || (this.uniformsBus[uniformName] = []);
    if (array[index] === uniformBus) {
      array[index] = null;
    }
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
    if (i !== -1) {
      this.dependents.splice(i, 1);
    }
  }
  _syncDependencies(newdeps) {
    const olddeps = this.dependencies;
    const additions = newdeps.filter(node => olddeps.indexOf(node) === -1);
    const deletions = olddeps.filter(node => newdeps.indexOf(node) === -1);
    olddeps.forEach(d => d._removeDependent(this));
    newdeps.forEach(d => d._addDependent(this));
    this.dependencies = newdeps;
    return [additions, deletions];
  }
  _bind() {
    if (this.framebuffer) {
      this.framebuffer.bind();
    } else {
      this.context.glSurface._bindRootNode();
    }
  }
  _captureAlloc(size) {
    let {
      capturePixelsArray
    } = this;
    if (capturePixelsArray && size !== capturePixelsArray.length) {
      _typedarrayPool.default.freeUint8(capturePixelsArray);
      capturePixelsArray = null;
    }
    const pixels = capturePixelsArray || _typedarrayPool.default.mallocUint8(size);
    this.capturePixelsArray = pixels;
    return pixels;
  }
  // in case of inline shader, a Node currently hold a Node

  _getShader(shaderProp) {
    const {
      glSurface
    } = this.context;
    const nodeName = this.getGLName();
    (0, _invariant.default)(shaderProp, nodeName + ": shader prop must be provided");
    if ((0, _Shaders.isShaderIdentifier)(shaderProp)) {
      // $FlowFixMe
      return glSurface._getShader(shaderProp);
    }
    const shaderInfo = (0, _Shaders.shaderDefinitionToShaderInfo)((0, _Shaders.ensureShaderDefinition)(shaderProp, " in " + nodeName), nodeName);
    const latestShaderInfo = this._latestShaderInfo;
    let shader = this._shader;
    if (!shader || !latestShaderInfo || !(0, _Shaders.shaderInfoEquals)(latestShaderInfo, shaderInfo)) {
      if (shader) {
        shader.dispose();
        delete this._shader;
      }
      shader = glSurface._makeShader(shaderInfo);
      this._latestShaderInfo = shaderInfo;
      this._shader = shader;
    }
    return shader;
  }
  _draw() {
    const {
      glSurface
    } = this.context;
    const {
      gl
    } = glSurface;
    const visitors = glSurface.getVisitors();
    const nodeName = this.getGLName();
    if (!gl || !this._needsRedraw) {
      visitors.forEach(v => v.onNodeDrawSkipped(this));
      return;
    }
    const {
      backbuffering,
      uniforms,
      uniformsOptions,
      shader: shaderProp,
      blendFunc,
      clear,
      onDraw,
      ignoreUnusedUniforms
    } = this.drawProps;

    //~ PREPARE phase

    if (!this.framebuffer) {
      const {
        glSizable
      } = this.context;
      const [width, height] = glSizable.getGLSize();
      const [nw, nh] = this.getGLSize();
      (0, _invariant.default)(nw === width && nh === height, nodeName + " is root but have overrided {width=%s,height=%s} which doesn't match Surface size {width=%s,height=%s}. " + "Try to wrap your Node in a <NearestCopy> or <LinearCopy>", nw, nh, width, height);
    }
    const shader = this._getShader(shaderProp);
    this._needsRedraw = false; // FIXME what's the correct position of this line?

    const {
      types
    } = shader;
    const glRedrawableDependencies = [];
    const pendingTextures = [];
    let units = 0;
    const usedUniforms = Object.keys(types.uniforms);
    const providedUniforms = Object.keys(uniforms);
    const {
      uniformsBus
    } = this;
    for (let k in uniformsBus) {
      if (!(k in uniforms)) {
        providedUniforms.push(k);
      }
    }
    const textureUnits = new Map();
    const prepareTexture = (initialObj, uniformOptions, uniformKeyName) => {
      let obj = initialObj,
        dependency,
        result;
      if (typeof obj === "function") {
        // texture uniform can be a function that resolves the object at draw time.
        obj = obj(this.redraw);
      }
      if (!obj) {
        if (obj === undefined) {
          console.warn(`${nodeName}, uniform '${uniformKeyName}' is undefined.` + "If you explicitely want to clear a texture, set it to null.");
        }
      } else if (isBackbuffer(obj)) {
        // maybe it's backbuffer?
        if (!this.drawProps.backbuffering) {
          console.warn(`${nodeName}, uniform ${uniformKeyName}: you must set \`backbuffering\` on Node when using Backbuffer`);
        }
        result = {
          glNode: this,
          glNodePickBackbuffer: true
        };
      } else if (isBackbufferFrom(obj)) {
        // backbuffer of another node/bus
        (0, _invariant.default)(typeof obj === "object", "invalid backbufferFromNode. Got: %s", obj);
        let node = obj.node;
        if (node instanceof _Bus.default) {
          node = node.getGLRenderableNode();
          (0, _invariant.default)(node, "backbufferFromNode(bus) but bus.getGLRenderableNode() is %s", node);
        }
        (0, _invariant.default)(node instanceof Node, "invalid backbufferFromNode(obj): obj must be an instanceof Node or Bus. Got: %s", obj);
        if (!node.drawProps.backbuffering) {
          console.warn(`${nodeName}, uniform ${uniformKeyName}: you must set \`backbuffering\` on the Node referenced in backbufferFrom(${node.getGLName()})`);
        }
        result = {
          glNode: node,
          glNodePickBackbuffer: true
        };
      } else if (obj instanceof Node) {
        // maybe it's a Node?
        dependency = obj;
        result = {
          glNode: obj
        };
      } else if (obj instanceof _Bus.default) {
        // maybe it's a Bus?
        // to a node?
        const node = obj.getGLRenderableNode();
        if (node) {
          dependency = node;
          result = {
            glNode: node
          };
        } else {
          // to a DOM/native element? (like <canvas>, <video>, ...)
          dependency = obj;
          const renderable = obj.getGLRenderableContent();
          if (!renderable) {
            console.warn(`${nodeName}, uniform ${uniformKeyName}: child is not renderable. Got:`, renderable);
            result = {
              directTexture: null
            };
          } else {
            obj = renderable;
          }
        }
      }

      // In any remaining cases, we are asking texture loaders
      // to concretely resolve the Texture.
      if (!result && obj) {
        const {
          loader,
          input
        } = glSurface._resolveTextureLoader(obj);
        if (!loader) {
          console.warn(`${nodeName}, uniform ${uniformKeyName}: no loader found for value`, input, obj);
        } else {
          const t = loader.get(input);
          if (t) {
            loader.update(input);
            result = {
              directTexture: t.texture,
              directTextureSize: [t.width, t.height]
            };
          } else {
            // otherwise, we will have to load it and postpone the rendering.
            const p = loader.load(input);
            pendingTextures.push(p);
          }
        }
      }

      // we also accumulate a dep, that will be used to build the gl graph.
      if (dependency) glRedrawableDependencies.push(dependency);
      const textureOptions = result ? uniformOptions : null;
      const getMetaInfo = () => ({
        initialObj,
        obj,
        dependency,
        textureOptions
      });
      const getSize = () => {
        const fallback = [2, 2];
        return result ? "directTextureSize" in result ? result.directTextureSize : result.glNode ? result.glNode.getGLSize() : fallback : fallback;
      };
      const prepare = () => {
        const texture = result && (result.directTexture || result.glNode && (result.glNodePickBackbuffer ? result.glNode.getGLBackbufferOutput() : result.glNode.getGLOutput())) || glSurface.getEmptyTexture();
        if (textureUnits.has(texture)) {
          // FIXME different uniform options on a same texture is not supported
          return textureUnits.get(texture);
        }
        const value = units++;
        gl.activeTexture(gl.TEXTURE0 + value);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        applyTextureOptions(gl, textureOptions);
        textureUnits.set(texture, value);
        return value;
      };
      return {
        getMetaInfo,
        getSize,
        prepare
      };
    };
    const prepareUniform = key => {
      const uniformType = types.uniforms[key];
      if (!uniformType) {
        const ignoredWarn = ignoreUnusedUniforms === true || ignoreUnusedUniforms instanceof Array && ignoreUnusedUniforms.includes(key);
        if (!ignoredWarn) {
          console.warn(`${nodeName} uniform '${key}' is not declared, nor used, in your shader code`);
        }
        return {
          key,
          value: undefined
        };
      }
      const uniformValue = uniforms[key];
      usedUniforms.splice(usedUniforms.indexOf(key), 1);
      if (uniformType === "sampler2D") {
        const uniformBus = uniformsBus[key];
        const {
          getMetaInfo,
          prepare
        } = prepareTexture(uniformBus && uniformBus[0] || uniformValue, uniformsOptions[key], key);
        return {
          key,
          type: uniformType,
          getMetaInfo,
          prepare
        };
      } else if (uniformValue === _Uniform.default.Resolution) {
        return {
          key,
          type: uniformType,
          value: this.getGLSize()
        };
      } else if (isTextureSizeGetter(uniformValue)) {
        (0, _invariant.default)(uniformValue && typeof uniformValue === "object", "unexpected textureSize object. Got: %s", uniformValue);
        const {
          getSize
        } = prepareTexture(uniformValue.obj, null, key);
        const size = getSize();
        if (!size) {
          console.warn(`${nodeName}, uniform ${key}: texture size is undetermined`);
        }
        const value = uniformValue.ratio ? size ? size[0] / size[1] : 1 : size || [0, 0];
        return {
          key,
          type: uniformType,
          value
        };
      } else if (Array.isArray(uniformType) && uniformType[0] === "sampler2D") {
        let values;
        const uniformBus = uniformsBus[key];
        const v = mergeArrays(Array.isArray(uniformValue) ? uniformValue : [], Array.isArray(uniformBus) ? uniformBus : []);
        if (!v.length) {
          console.warn(`${nodeName}, uniform '${key}' should be an array of textures.`);
          values = uniformType.map(() => null);
        } else if (v.length !== uniformType.length) {
          console.warn(`${nodeName}, uniform '${key}' should be an array of exactly ${uniformType.length} textures (not ${v.length}).`);
          values = uniformType.map(() => null);
        } else {
          values = v;
        }
        const uniformOptions = uniformsOptions[key]; // TODO support array of options as well
        const all = values.map((value, i) => prepareTexture(value, uniformOptions, key + "[" + i + "]"));
        return {
          key,
          type: uniformType,
          getMetaInfo: () => all.reduce((acc, o) => acc.concat(o.getMetaInfo()), []),
          prepare: () => all.map(o => o.prepare())
        };
      } else {
        if (uniformValue === undefined) {
          console.warn(`${nodeName}, uniform '${key}' is undefined.`);
        }
        return {
          key,
          type: uniformType,
          value: uniformValue
        };
      }
    };
    const preparedUniforms = providedUniforms.map(prepareUniform);
    if (usedUniforms.length !== 0) {
      console.warn(nodeName + ": Missing uniforms: " + usedUniforms.map(u => `'${u}'`).join(", ") + "\n" + "all uniforms must be provided " + "because implementations might share and reuse a Shader Program");
    }

    // if some textures are not ready, we freeze the rendering so it doesn't blink
    if (pendingTextures.length > 0) {
      Promise.all(pendingTextures).then(this.redraw);
      // ^ FIXME "cancel" this promise if we ever come back in _draw()
      visitors.forEach(v => v.onNodeDrawSkipped(this));
      return;
    }

    //~ the draw will happen, there is no more interruption cases.
    visitors.forEach(v => v.onNodeDrawStart(this));
    const [additions, deletions] = this._syncDependencies(glRedrawableDependencies);
    visitors.forEach(v => v.onNodeSyncDeps(this, additions, deletions));
    if (backbuffering) {
      // swap framebuffer and backbuffer
      const {
        backbuffer,
        framebuffer
      } = this;
      this.backbuffer = framebuffer;
      if (backbuffer) {
        this.framebuffer = backbuffer;
      }
    }

    //~ DRAW dependencies step
    const drawDep = d => d._draw();
    this.dependencies.forEach(drawDep);

    //~ DRAW this node step

    visitors.forEach(v => v.onNodeDraw(this, preparedUniforms));
    shader.bind();
    this._bind();
    preparedUniforms.forEach(obj => {
      const value = obj.prepare ? obj.prepare() : obj.value;
      if (value !== undefined) {
        shader.uniforms[obj.key] = value;
      }
    });
    if (blendFunc) {
      const src = mapBlendFunc(gl, blendFunc.src);
      const dst = mapBlendFunc(gl, blendFunc.dst);
      if (src && dst) gl.blendFunc(src, dst);
    }
    if (clear) {
      gl.clearColor(...clear.color);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (onDraw) onDraw();
    visitors.forEach(v => v.onNodeDrawEnd(this));
  }
}
exports.default = Node;
// Node/Surface that depends on this instance
_defineProperty(Node, "propTypes", NodePropTypes);
_defineProperty(Node, "defaultProps", {
  uniformsOptions: {},
  uniforms: {},
  blendFunc: {
    // FIXME should this actually just be null by default? opt-in?
    src: "src alpha",
    dst: "one minus src alpha"
  },
  clear: {
    color: [0, 0, 0, 0]
  }
});
_defineProperty(Node, "contextType", _GLContext.default);
//# sourceMappingURL=Node.js.map