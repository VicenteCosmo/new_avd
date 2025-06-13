"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const XmlStream = require('../../../utils/xml-stream');
const BaseXform = require('../base-xform');
class PivotCacheRecordsXform extends BaseXform {
  constructor() {
    super();
    this.map = {};
  }
  prepare(model) {
    // TK
  }
  get tag() {
    // http://www.datypic.com/sc/ooxml/e-ssml_pivotCacheRecords.html
    return 'pivotCacheRecords';
  }
  render(xmlStream, model) {
    const {
      sourceSheet,
      cacheFields
    } = model;
    const sourceBodyRows = sourceSheet.getSheetValues().slice(2);
    xmlStream.openXml(XmlStream.StdDocAttributes);
    xmlStream.openNode(this.tag, _objectSpread(_objectSpread({}, PivotCacheRecordsXform.PIVOT_CACHE_RECORDS_ATTRIBUTES), {}, {
      count: sourceBodyRows.length
    }));
    xmlStream.writeXml(renderTable());
    xmlStream.closeNode();

    // Helpers

    function renderTable() {
      const rowsInXML = sourceBodyRows.map(row => {
        const realRow = row.slice(1);
        return [...renderRowLines(realRow)].join('');
      });
      return rowsInXML.join('');
    }
    function* renderRowLines(row) {
      // PivotCache Record: http://www.datypic.com/sc/ooxml/e-ssml_r-1.html
      // Note: pretty-printing this for now to ease debugging.
      yield '\n  <r>';
      for (const [index, cellValue] of row.entries()) {
        yield '\n    ';
        yield renderCell(cellValue, cacheFields[index].sharedItems);
      }
      yield '\n  </r>';
    }
    function renderCell(value, sharedItems) {
      // no shared items
      // --------------------------------------------------
      if (sharedItems === null) {
        if (Number.isFinite(value)) {
          // Numeric value: http://www.datypic.com/sc/ooxml/e-ssml_n-2.html
          return "<n v=\"".concat(value, "\" />");
        }
        // Character Value: http://www.datypic.com/sc/ooxml/e-ssml_s-2.html
        return "<s v=\"".concat(value, "\" />");
      }

      // shared items
      // --------------------------------------------------
      const sharedItemsIndex = sharedItems.indexOf(value);
      if (sharedItemsIndex < 0) {
        throw new Error("".concat(JSON.stringify(value), " not in sharedItems ").concat(JSON.stringify(sharedItems)));
      }
      // Shared Items Index: http://www.datypic.com/sc/ooxml/e-ssml_x-9.html
      return "<x v=\"".concat(sharedItemsIndex, "\" />");
    }
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
PivotCacheRecordsXform.PIVOT_CACHE_RECORDS_ATTRIBUTES = {
  xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
  'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  'xmlns:mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  'mc:Ignorable': 'xr',
  'xmlns:xr': 'http://schemas.microsoft.com/office/spreadsheetml/2014/revision'
};
module.exports = PivotCacheRecordsXform;
//# sourceMappingURL=pivot-cache-records-xform.js.map
