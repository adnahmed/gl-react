"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = exports.default = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _glShader = _interopRequireDefault(require("gl-shader"));
var _Bus = _interopRequireDefault(require("./Bus"));
var _Shaders = _interopRequireDefault(require("./Shaders"));
var _Visitors = _interopRequireDefault(require("./Visitors"));
var _webgltextureLoader = require("webgltexture-loader");
var _GLContext = _interopRequireDefault(require("./GLContext"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const __DEV__ = process.env.NODE_ENV === "development";
const SurfacePropTypes = {
  children: _propTypes.default.any.isRequired,
  style: _propTypes.default.any,
  preload: _propTypes.default.array,
  onLoad: _propTypes.default.func,
  onLoadError: _propTypes.default.func,
  onContextLost: _propTypes.default.func,
  onContextRestored: _propTypes.default.func,
  visitor: _propTypes.default.object
};
let surfaceId = 0;
const _instances = [];
const list = () => _instances.slice(0);
exports.list = list;
const allSurfaceProps = Object.keys(SurfacePropTypes);
var _default = ({
  GLView,
  RenderLessElement,
  mapRenderableContent,
  requestFrame,
  cancelFrame
}) => {
  var _Surface;
  /**
   * **Renders the final tree of [Node](#node) in a WebGL Canvas / OpenGLView /...**
   *
   * `<Surface>` performs the final GL draws for a given implementation.
   *
   * `width` and `height` props are required for `gl-react-dom` and `gl-react-headless`, but are not supported for React Native, where the paradigm is to use `style` (and either use flexbox or set a width/height from there).
   *
   * > Surface is the only component that isn't "universal",
   * therefore **Surface is exposed by the platform implementation**
   * (`gl-react-dom` / `gl-react-native` / ...),
   * unlike the rest of the API exposed through `gl-react`.
   * Each platform have its own implementation but most props are shared.
   * If you write a gl-react library, you shouldn't use `<Surface>` but only
   * let the final user doing it. Therefore your code should remain platform-independant.
   *
   * @class Surface
   * @extends Component
   * @prop {any} children - a tree of React Element that renders some [Node](#node) and/or [Bus](#bus).
   * @prop {number} [width] **(only for DOM)** - width of the Surface. multiplied by `pixelRatio` for the actual canvas pixel size.
   * @prop {number} [height] **(only for DOM)** - height of the Surface. multiplied by `pixelRatio` for the actual canvas pixel size.
   * @prop {object} [style] - CSS styles that get passed to the underlying `<canvas/>` or `<View/>`
   * @prop {Array<any>} [preload] - an array of things to preload before the Surface start rendering. Help avoiding blinks and providing required textures to render an initial state.
   * @prop {function} [onLoad] - a callback called when Surface is ready and just after it rendered.
   * @prop {function(error:Error):void} [onLoadError] - a callback called when the Surface was not able to load initially.
   * @prop {function} [onContextLost] - a callback called when the Surface context was lost.
   * @prop {function} [onContextRestored] - a callback called when the Surface was restored and ready.
   * @prop {Visitor} [visitor] - an internal visitor used for logs and tests.
   *
   * @prop {WebGLContextAttributes} [webglContextAttributes] **(gl-react-dom only)** a optional set of attributes to init WebGL with.
   * @prop {number} [pixelRatio=window.devicePixelRatio] **(gl-react-dom only)** allows to override the pixelRatio. (default `devicePixelRatio`)
   *
   * @example
   *
   *  <Surface width={300} height={200}>
   *    <Node shader={shaders.helloGL} />
   *  </Surface>
   *
   * @example
   *
   *  <Surface width={200} height={100}>
   *    <HelloGL />
   *  </Surface>
   *
   * @example
   *
   *  <Surface width={200} height={100}>
   *    <Blur factor={2}>
   *      <Negative>
   *        https://i.imgur.com/wxqlQkh.jpg
   *      </Negative>
   *    </Blur>
   *  </Surface>
   */
  return _Surface = class Surface extends _react.Component {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "id", ++surfaceId);
      _defineProperty(this, "gl", void 0);
      _defineProperty(this, "buffer", void 0);
      _defineProperty(this, "loaderResolver", void 0);
      _defineProperty(this, "glView", void 0);
      _defineProperty(this, "root", void 0);
      _defineProperty(this, "shaders", {});
      _defineProperty(this, "_preparingGL", []);
      _defineProperty(this, "_needsRedraw", false);
      _defineProperty(this, "state", {
        ready: false,
        rebootId: 0,
        debug: false
      });
      _defineProperty(this, "RenderLessElement", RenderLessElement);
      _defineProperty(this, "mapRenderableContent", mapRenderableContent);
      /**
       * Schedule a redraw of the Surface.
       * @memberof Surface
       * @instance
       * @function
       */
      _defineProperty(this, "redraw", () => {
        this._needsRedraw = true;
      });
      /**
       * Force the redraw (if any) to happen now, synchronously.
       * @memberof Surface
       * @instance
       * @function
       */
      _defineProperty(this, "flush", () => {
        this._draw();
      });
      _defineProperty(this, "_emptyTexture", void 0);
      _defineProperty(this, "_onContextCreate", gl => {
        const onSuccess = () => {
          this.setState({
            ready: true
          }, () => {
            try {
              this._handleLoad();
            } catch (e) {
              this._handleError(e);
            }
          });
        };
        this._prepareGL(gl, onSuccess, this._handleError);
      });
      _defineProperty(this, "_onContextFailure", e => {
        this._handleError(e);
      });
      _defineProperty(this, "_onContextLost", () => {
        if (this.props.onContextLost) this.props.onContextLost();
        this._stopLoop();
        this._destroyGL();
        if (this.root) this.root._onContextLost();
      });
      _defineProperty(this, "_onContextRestored", gl => {
        if (this.root) this.root._onContextRestored(gl);
        this._prepareGL(gl, this._handleRestoredSuccess, this._handleRestoredFailure);
      });
      _defineProperty(this, "_onRef", ref => {
        this.glView = ref;
      });
      _defineProperty(this, "_handleError", e => {
        const {
          onLoadError
        } = this.props;
        if (onLoadError) onLoadError(e);else {
          console.error(e);
        }
      });
      _defineProperty(this, "_handleRestoredFailure", () => {
        // there is nothing we can do. it's a dead end.
      });
      _defineProperty(this, "_handleRestoredSuccess", () => {
        this.redraw();
        this.flush();
        this._startLoop();
        if (this.props.onContextRestored) this.props.onContextRestored();
      });
      _defineProperty(this, "_handleLoad", () => {
        if (!this.root) {
          console.warn(this.getGLName() + " children does not contain any discoverable Node");
        }
        const {
          onLoad
        } = this.props;
        this.redraw();
        this.flush();
        this._startLoop();
        if (onLoad) onLoad();
      });
      _defineProperty(this, "_loopRaf", void 0);
    }
    componentDidMount() {
      _instances.push(this);
      this.getVisitors().forEach(v => v.onSurfaceMount(this));
    }
    componentWillUnmount() {
      this._stopLoop();
      this._destroyGL();
      const i = _instances.indexOf(this);
      if (i !== -1) _instances.splice(i, 1);
      this.getVisitors().forEach(v => v.onSurfaceUnmount(this));
    }
    componentDidUpdate() {
      this.redraw();
    }
    render() {
      const {
        props,
        state: {
          ready,
          rebootId,
          debug
        }
      } = this;
      const {
        children,
        style
      } = props;

      // We allow to pass-in all props we don't know so you can hook to DOM events.
      const rest = {};
      Object.keys(props).forEach(key => {
        if (allSurfaceProps.indexOf(key) === -1) {
          rest[key] = props[key];
        }
      });
      return /*#__PURE__*/_react.default.createElement(_GLContext.default.Provider, {
        value: {
          glParent: this,
          glSurface: this,
          glSizable: this
        }
      }, /*#__PURE__*/_react.default.createElement(GLView, _extends({
        key: rebootId,
        debug: debug,
        ref: this._onRef,
        onContextCreate: this._onContextCreate,
        onContextFailure: this._onContextFailure,
        onContextLost: this._onContextLost,
        onContextRestored: this._onContextRestored,
        style: style
      }, rest), ready ? children : null));
    }
    rebootForDebug() {
      // FIXME: there is a bug somewhere that breaks rendering if this is called at startup time.
      this._stopLoop();
      this._destroyGL();
      this.setState(({
        rebootId
      }) => ({
        rebootId: rebootId + 1,
        ready: false,
        debug: true
      }));
    }
    getVisitors() {
      return _Visitors.default.get().concat(this.props.visitor || []);
    }
    getGLSize() {
      const {
        gl
      } = this;
      return [gl ? gl.drawingBufferWidth : 0, gl ? gl.drawingBufferHeight : 0];
    }
    getGLName() {
      return `Surface#${this.id}`;
    }
    getGLShortName() {
      return "Surface";
    }

    /**
     * see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
     * @param {string} mimeType (optional) the image MimeType
     * @param {number} quality (optional) the image quality
     * @memberof Surface
     * @instance
     */
    captureAsDataURL(...args) {
      const {
        glView
      } = this;
      (0, _invariant.default)(glView, "GLView is mounted");
      (0, _invariant.default)(glView.captureAsDataURL, "captureAsDataURL is not defined in %s", GLView.displayName || GLView.name);
      return glView.captureAsDataURL(...args);
    }

    /**
     * see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
     * @param {string} mimeType (optional) the image MimeType
     * @param {number} quality (optional) the image quality
     * @memberof Surface
     * @instance
     */
    captureAsBlob(...args) {
      const {
        glView
      } = this;
      (0, _invariant.default)(glView, "GLView is mounted");
      (0, _invariant.default)(glView.captureAsBlob, "captureAsBlob is not defined in %s", GLView.displayName || GLView.name);
      return glView.captureAsBlob(...args);
    }

    /**
     * capture the root Node pixels. Make sure you have set `preserveDrawingBuffer: true` in `webglContextAttributes` prop.
     * @memberof Surface
     * @instance
     */
    capture(x, y, w, h) {
      (0, _invariant.default)(this.root, "Surface#capture: surface is not yet ready or don't have any root Node");
      return this.root.capture(x, y, w, h);
    }
    glIsAvailable() {
      return !!this.gl;
    }
    getEmptyTexture() {
      let {
        gl,
        _emptyTexture
      } = this;
      (0, _invariant.default)(gl, "getEmptyTexture called while gl was not defined");
      if (!_emptyTexture) {
        this._emptyTexture = _emptyTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, _emptyTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
      }
      return _emptyTexture;
    }
    _destroyGL() {
      const {
        gl
      } = this;
      if (gl) {
        this.gl = null;
        if (this._emptyTexture) {
          gl.deleteTexture(this._emptyTexture);
          this._emptyTexture = null;
        }
        if (this.loaderResolver) {
          this.loaderResolver.dispose();
        }
        for (let k in this.shaders) {
          this.shaders[k].dispose();
        }
        this.shaders = {};
        gl.deleteBuffer(this.buffer);
        this.getVisitors().map(v => v.onSurfaceGLContextChange(this, null));
      }
    }
    _prepareGL(gl, onSuccess, onError) {
      this.gl = gl;
      this.getVisitors().map(v => v.onSurfaceGLContextChange(this, gl));
      this.loaderResolver = new _webgltextureLoader.LoaderResolver(gl);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 4, 4, -1]),
      // see a-big-triangle
      gl.STATIC_DRAW);
      this.buffer = buffer;
      const {
        preload
      } = this.props;
      const all = [];
      (preload || []).forEach(raw => {
        if (!raw) {
          console.warn("Can't preload value", raw);
          return;
        }
        const {
          loader,
          input
        } = this._resolveTextureLoader(raw);
        if (!loader) {
          console.warn("Can't preload input", raw, input);
          return;
        }
        const loadedAlready = loader.get(input);
        if (loadedAlready) return;
        all.push(loader.load(input));
      });
      this._preparingGL = all;
      if (all.length > 0) {
        Promise.all(all).then(onSuccess, onError); // FIXME make sure this never finish if _prepareGL is called again.
      } else {
        onSuccess();
      }
    }
    _addGLNodeChild(node) {
      (0, _invariant.default)(!this.root, "Surface can only contains a single root. Got: %s", this.root && this.root.getGLName());
      this.root = node;
      node._addDependent(this);
      this.redraw();
    }
    _removeGLNodeChild(node) {
      this.root = null;
      this.redraw();
    }
    _resolveTextureLoader(raw) {
      let input = raw;
      let loader = this.loaderResolver && this.loaderResolver.resolve(input);
      return {
        loader,
        input
      };
    }
    _makeShader({
      frag,
      vert
    }, name) {
      const {
        gl
      } = this;
      (0, _invariant.default)(gl, "gl is not available");
      const shader = (0, _glShader.default)(gl, vert, frag);
      for (let key in shader.attributes) {
        shader.attributes[key].pointer();
      }
      return shader;
    }
    _getShader(shaderId) {
      const {
        shaders
      } = this;
      return shaders[shaderId.id] || (shaders[shaderId.id] = this._makeShader(_Shaders.default.get(shaderId), _Shaders.default.getName(shaderId)));
    }
    _bindRootNode() {
      const {
        gl
      } = this;
      (0, _invariant.default)(gl, "gl context not available");
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      const [width, height] = this.getGLSize();
      gl.viewport(0, 0, width, height);
    }
    _startLoop() {
      cancelFrame(this._loopRaf);
      const loop = () => {
        this._loopRaf = requestFrame(loop);
        if (this._needsRedraw) this._draw();
      };
      this._loopRaf = requestFrame(loop);
    }
    _stopLoop() {
      cancelFrame(this._loopRaf);
    }
    _draw() {
      const {
        gl,
        root,
        glView
      } = this;
      (0, _invariant.default)(glView, "GLView is mounted");
      const visitors = this.getVisitors();
      if (!gl || !root || !this._needsRedraw) {
        visitors.forEach(v => v.onSurfaceDrawSkipped(this));
        return;
      }
      this._needsRedraw = false;
      visitors.forEach(v => v.onSurfaceDrawStart(this));
      if (glView.beforeDraw) glView.beforeDraw(gl);
      try {
        root._draw();
      } catch (e) {
        let silent = false;
        visitors.forEach(v => {
          silent = v.onSurfaceDrawError(e) || silent;
        });
        if (!silent) {
          if (__DEV__ && glView.debugError && e.longMessage /* duck typing an "interesting" GLError (from lib gl-shader) */) {
            glView.debugError(e);
          } else {
            console.warn(e);
            throw e;
          }
        }
        return;
      }
      if (glView.afterDraw) glView.afterDraw(gl);
      visitors.forEach(v => v.onSurfaceDrawEnd(this));
    }
  }, _defineProperty(_Surface, "propTypes", SurfacePropTypes), _Surface;
};
exports.default = _default;
//# sourceMappingURL=createSurface.js.map