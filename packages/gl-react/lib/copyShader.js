"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _GLSL = _interopRequireDefault(require("./GLSL"));
var _Shaders = _interopRequireDefault(require("./Shaders"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = _Shaders.default.create({
  copy: {
    frag: (0, _GLSL.default)`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
void main(){
  gl_FragColor=texture2D(t,uv);
}`
  }
}).copy;
//# sourceMappingURL=copyShader.js.map