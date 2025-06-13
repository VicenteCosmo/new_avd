"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const BaseXform = require('../base-xform');
const CacheField = require('./cache-field');
const XmlStream = require('../../../utils/xml-stream');
class PivotCacheDefinitionXform extends BaseXform {
  constructor() {
    super();
    this.map = {};
  }
  prepare(model) {
    // TK
  }
  get tag() {
    // http://www.datypic.com/sc/ooxml/e-ssml_pivotCacheDefinition.html
    return 'pivotCacheDefinition';
  }
  render(xmlStream, model) {
    const {
      sourceSheet,
      cacheFields
    } = model;
    xmlStream.openXml(XmlStream.StdDocAttributes);
    xmlStream.openNode(this.tag, _objectSpread(_objectSpread({}, PivotCacheDefinitionXform.PIVOT_CACHE_DEFINITION_ATTRIBUTES), {}, {
      'r:id': 'rId1',
      refreshOnLoad: '1',
      // important for our implementation to work
      refreshedBy: 'Author',
      refreshedDate: '45125.026046874998',
      createdVersion: '8',
      refreshedVersion: '8',
      minRefreshableVersion: '3',
      recordCount: cacheFields.length + 1
    }));
    xmlStream.openNode('cacheSource', {
      type: 'worksheet'
    });
    xmlStream.leafNode('worksheetSource', {
      ref: sourceSheet.dimensions.shortRange,
      sheet: sourceSheet.name
    });
    xmlStream.closeNode();
    xmlStream.openNode('cacheFields', {
      count: cacheFields.length
    });
    // Note: keeping this pretty-printed for now to ease debugging.
    xmlStream.writeXml(cacheFields.map(cacheField => new CacheField(cacheField).render()).join('\n    '));
    xmlStream.closeNode();
    xmlStream.closeNode();
  }
  parseOpen(node) {
    // TK
  }
  parseText(text) {
    // TK
  }
  parseClose(name) {
    // TK
  }
  reconcile(model, options) {
    // TK
  }
}
PivotCacheDefinitionXform.PIVOT_CACHE_DEFINITION_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'xr',
  'xmlns:xr': 'http://schemas.microsoft.com/office/spreadsheetml/2014/revision'
};
module.exports = PivotCacheDefinitionXform;
//# sourceMappingURL=pivot-cache-definition-xform.js.map
