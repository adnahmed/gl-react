"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _log = _interopRequireDefault(require("./helpers/log"));
var _Visitor = _interopRequireDefault(require("./Visitor"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable no-console */
const aggregateInfo = info => Array.isArray(info) ? info.reduce((acc, info) => acc.concat(aggregateInfo(info)), []) : [String(info.dependency && info.dependency.getGLName() || info.initialObj)].concat(info.textureOptions ? [info.textureOptions] : []);

/**
 *
 */
class VisitorLogger extends _Visitor.default {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "groupNestedLvl", 0);
  }
  onSurfaceGLContextChange(surface, gl) {
    if (gl) {
      (0, _log.default)(surface.getGLName() + " _context acquired_");
    } else {
      (0, _log.default)(surface.getGLName() + " _context lost_");
    }
  }
  onSurfaceDrawSkipped() {}
  onSurfaceDrawStart(surface) {
    const [width, height] = surface.getGLSize();
    console.groupCollapsed("Surface draw");
    this.groupNestedLvl = 1;
    (0, _log.default)("_size_ `" + width + "`x`" + height + "`");
  }
  onSurfaceDrawError(e) {
    console.error(e);
    while (this.groupNestedLvl > 0) {
      console.groupEnd();
      this.groupNestedLvl--;
    }
    return true;
  }
  onSurfaceDrawEnd() {
    this.groupNestedLvl--;
    console.groupEnd();
  }
  onNodeDrawSkipped(node) {
    (0, _log.default)(node.getGLName() + " redraw _skipped_: " + (!node.context.glSurface.gl ? "no gl context available!" : !node._needsRedraw ? "no need to redraw" : ""));
  }
  onNodeDrawStart(node) {
    this.groupNestedLvl++;
    console.group(node.getGLName());
  }
  onNodeSyncDeps(node, additions, deletions) {
    if (additions.length) console.log(node.getGLName() + " +deps " + additions.map(n => n.getGLName()).join(", "));
    if (deletions.length) console.log(node.getGLName() + " -deps " + additions.map(n => n.getGLName()).join(", "));
  }
  onNodeDraw(node, preparedUniforms) {
    const {
      blendFunc,
      clear
    } = node.props;
    this.groupNestedLvl++;
    console.group("DRAW " + node.getGLName());
    const [w, h] = node.getGLSize();
    (0, _log.default)("_size_ `" + w + "`x`" + h + "` " + "_clear_ `" + JSON.stringify(clear) + "` " + "_blendFunc_ `" + JSON.stringify(blendFunc) + "`");
    (0, _log.default)("_" + preparedUniforms.length + " uniforms:_");
    preparedUniforms.forEach(obj => {
      let {
        key,
        type,
        value,
        getMetaInfo
      } = obj;
      type = String(type || "UNKNOWN");
      const values = value === undefined ? "" : Array.isArray(value) ? "[" + value.map(v => "`" + String(v) + "`").join(",") + "]" : "`" + String(value) + "`";
      let spaces = "";
      for (let i = type.length + key.length - 18; i < 0; i++) {
        spaces += " ";
      }
      (0, _log.default)(`${spaces}*${type === "UNKNOWN" ? "[c='color:red']UNKNOWN[c]" : type}* _${key}_ = ${values}`, ...(getMetaInfo ? aggregateInfo(getMetaInfo()) : []));
    });
  }
  onNodeDrawEnd() {
    this.groupNestedLvl -= 2;
    console.groupEnd();
    console.groupEnd();
  }
}
exports.default = VisitorLogger;
//# sourceMappingURL=VisitorLogger.js.map