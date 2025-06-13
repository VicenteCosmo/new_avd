"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const oneDepthCopy = (obj, nestKeys) => _objectSpread(_objectSpread({}, obj), nestKeys.reduce((memo, key) => {
  if (obj[key]) memo[key] = _objectSpread({}, obj[key]);
  return memo;
}, {}));
const setIfExists = function (src, dst, key) {
  let nestKeys = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  if (src[key]) dst[key] = oneDepthCopy(src[key], nestKeys);
};
const isEmptyObj = obj => Object.keys(obj).length === 0;
const copyStyle = style => {
  if (!style) return style;
  if (isEmptyObj(style)) return {};
  const copied = _objectSpread({}, style);
  setIfExists(style, copied, 'font', ['color']);
  setIfExists(style, copied, 'alignment');
  setIfExists(style, copied, 'protection');
  if (style.border) {
    setIfExists(style, copied, 'border');
    setIfExists(style.border, copied.border, 'top', ['color']);
    setIfExists(style.border, copied.border, 'left', ['color']);
    setIfExists(style.border, copied.border, 'bottom', ['color']);
    setIfExists(style.border, copied.border, 'right', ['color']);
    setIfExists(style.border, copied.border, 'diagonal', ['color']);
  }
  if (style.fill) {
    setIfExists(style, copied, 'fill', ['fgColor', 'bgColor', 'center']);
    if (style.fill.stops) {
      copied.fill.stops = style.fill.stops.map(s => oneDepthCopy(s, ['color']));
    }
  }
  return copied;
};
exports.copyStyle = copyStyle;
//# sourceMappingURL=copy-style.js.map
