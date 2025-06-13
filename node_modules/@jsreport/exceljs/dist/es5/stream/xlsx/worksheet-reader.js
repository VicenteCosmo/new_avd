"use strict";

function _awaitAsyncGenerator(e) { return new _OverloadYield(e, 0); }
function _wrapAsyncGenerator(e) { return function () { return new AsyncGenerator(e.apply(this, arguments)); }; }
function AsyncGenerator(e) { var r, t; function resume(r, t) { try { var n = e[r](t), o = n.value, u = o instanceof _OverloadYield; Promise.resolve(u ? o.v : o).then(function (t) { if (u) { var i = "return" === r ? "return" : "next"; if (!o.k || t.done) return resume(i, t); t = e[i](t).value; } settle(n.done ? "return" : "normal", t); }, function (e) { resume("throw", e); }); } catch (e) { settle("throw", e); } } function settle(e, n) { switch (e) { case "return": r.resolve({ value: n, done: !0 }); break; case "throw": r.reject(n); break; default: r.resolve({ value: n, done: !1 }); } (r = r.next) ? resume(r.key, r.arg) : t = null; } this._invoke = function (e, n) { return new Promise(function (o, u) { var i = { key: e, arg: n, resolve: o, reject: u, next: null }; t ? t = t.next = i : (r = t = i, resume(e, n)); }); }, "function" != typeof e.return && (this.return = void 0); }
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; }, AsyncGenerator.prototype.next = function (e) { return this._invoke("next", e); }, AsyncGenerator.prototype.throw = function (e) { return this._invoke("throw", e); }, AsyncGenerator.prototype.return = function (e) { return this._invoke("return", e); };
function _OverloadYield(e, d) { this.v = e, this.k = d; }
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function (r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function () { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function (r) { var n = this.s.return; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, throw: function (r) { var n = this.s.return; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
const {
  EventEmitter
} = require('events');
const parseSax = require('../../utils/parse-sax');
const _ = require('../../utils/under-dash');
const utils = require('../../utils/utils');
const colCache = require('../../utils/col-cache');
const Dimensions = require('../../doc/range');
const Row = require('../../doc/row');
const Column = require('../../doc/column');
class WorksheetReader extends EventEmitter {
  constructor(_ref) {
    let {
      workbook,
      id,
      iterator,
      options
    } = _ref;
    super();
    this.workbook = workbook;
    this.id = id;
    this.iterator = iterator;
    this.options = options || {};

    // and a name
    this.name = "Sheet".concat(this.id);

    // column definitions
    this._columns = null;
    this._keys = {};

    // keep a record of dimensions
    this._dimensions = new Dimensions();
  }

  // destroy - not a valid operation for a streaming writer
  // even though some streamers might be able to, it's a bad idea.
  destroy() {
    throw new Error('Invalid Operation: destroy');
  }

  // return the current dimensions of the writer
  get dimensions() {
    return this._dimensions;
  }

  // =========================================================================
  // Columns

  // get the current columns array.
  get columns() {
    return this._columns;
  }

  // get a single column by col number. If it doesn't exist, it and any gaps before it
  // are created.
  getColumn(c) {
    if (typeof c === 'string') {
      // if it matches a key'd column, return that
      const col = this._keys[c];
      if (col) {
        return col;
      }

      // otherise, assume letter
      c = colCache.l2n(c);
    }
    if (!this._columns) {
      this._columns = [];
    }
    if (c > this._columns.length) {
      let n = this._columns.length + 1;
      while (n <= c) {
        this._columns.push(new Column(this, n++));
      }
    }
    return this._columns[c - 1];
  }
  getColumnKey(key) {
    return this._keys[key];
  }
  setColumnKey(key, value) {
    this._keys[key] = value;
  }
  deleteColumnKey(key) {
    delete this._keys[key];
  }
  eachColumnKey(f) {
    _.each(this._keys, f);
  }
  async read() {
    try {
      var _iteratorAbruptCompletion = false;
      var _didIteratorError = false;
      var _iteratorError;
      try {
        for (var _iterator = _asyncIterator(this.parse()), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
          const events = _step.value;
          {
            for (const {
              eventType,
              value
            } of events) {
              this.emit(eventType, value);
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion && _iterator.return != null) {
            await _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
      this.emit('finished');
    } catch (error) {
      this.emit('error', error);
    }
  }
  [Symbol.asyncIterator]() {
    var _this = this;
    return _wrapAsyncGenerator(function* () {
      var _iteratorAbruptCompletion2 = false;
      var _didIteratorError2 = false;
      var _iteratorError2;
      try {
        for (var _iterator2 = _asyncIterator(_this.parse()), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _awaitAsyncGenerator(_iterator2.next())).done; _iteratorAbruptCompletion2 = false) {
          const events = _step2.value;
          {
            for (const {
              eventType,
              value
            } of events) {
              if (eventType === 'row') {
                yield value;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion2 && _iterator2.return != null) {
            yield _awaitAsyncGenerator(_iterator2.return());
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    })();
  }
  parse() {
    var _this2 = this;
    return _wrapAsyncGenerator(function* () {
      const {
        iterator,
        options
      } = _this2;
      let emitSheet = false;
      let emitHyperlinks = false;
      let hyperlinks = null;
      switch (options.worksheets) {
        case 'emit':
          emitSheet = true;
          break;
        case 'prep':
          break;
        default:
          break;
      }
      switch (options.hyperlinks) {
        case 'emit':
          emitHyperlinks = true;
          break;
        case 'cache':
          _this2.hyperlinks = hyperlinks = {};
          break;
        default:
          break;
      }
      if (!emitSheet && !emitHyperlinks && !hyperlinks) {
        return;
      }

      // references
      const {
        sharedStrings,
        styles,
        properties
      } = _this2.workbook;

      // xml position
      let inCols = false;
      let inRows = false;
      let inHyperlinks = false;

      // parse state
      let cols = null;
      let row = null;
      let c = null;
      let current = null;
      var _iteratorAbruptCompletion3 = false;
      var _didIteratorError3 = false;
      var _iteratorError3;
      try {
        for (var _iterator3 = _asyncIterator(parseSax(iterator)), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _awaitAsyncGenerator(_iterator3.next())).done; _iteratorAbruptCompletion3 = false) {
          const events = _step3.value;
          {
            const worksheetEvents = [];
            for (const {
              eventType,
              value
            } of events) {
              if (eventType === 'opentag') {
                const node = value;
                if (emitSheet) {
                  switch (node.name) {
                    case 'cols':
                      inCols = true;
                      cols = [];
                      break;
                    case 'sheetData':
                      inRows = true;
                      break;
                    case 'col':
                      if (inCols) {
                        cols.push({
                          min: parseInt(node.attributes.min, 10),
                          max: parseInt(node.attributes.max, 10),
                          width: parseFloat(node.attributes.width),
                          styleId: parseInt(node.attributes.style || '0', 10)
                        });
                      }
                      break;
                    case 'row':
                      if (inRows) {
                        const r = parseInt(node.attributes.r, 10);
                        row = new Row(_this2, r);
                        if (node.attributes.ht) {
                          row.height = parseFloat(node.attributes.ht);
                        }
                        if (node.attributes.s) {
                          const styleId = parseInt(node.attributes.s, 10);
                          const style = styles.getStyleModel(styleId);
                          if (style) {
                            row.style = style;
                          }
                        }
                      }
                      break;
                    case 'c':
                      if (row) {
                        c = {
                          ref: node.attributes.r,
                          s: parseInt(node.attributes.s, 10),
                          t: node.attributes.t
                        };
                      }
                      break;
                    case 'f':
                      if (c) {
                        current = c.f = {
                          text: ''
                        };
                      }
                      break;
                    case 'v':
                      if (c) {
                        current = c.v = {
                          text: ''
                        };
                      }
                      break;
                    case 'is':
                    case 't':
                      if (c) {
                        current = c.v = {
                          text: ''
                        };
                      }
                      break;
                    case 'mergeCell':
                      break;
                    default:
                      break;
                  }
                }

                // =================================================================
                //
                if (emitHyperlinks || hyperlinks) {
                  switch (node.name) {
                    case 'hyperlinks':
                      inHyperlinks = true;
                      break;
                    case 'hyperlink':
                      if (inHyperlinks) {
                        const hyperlink = {
                          ref: node.attributes.ref,
                          rId: node.attributes['r:id']
                        };
                        if (emitHyperlinks) {
                          worksheetEvents.push({
                            eventType: 'hyperlink',
                            value: hyperlink
                          });
                        } else {
                          hyperlinks[hyperlink.ref] = hyperlink;
                        }
                      }
                      break;
                    default:
                      break;
                  }
                }
              } else if (eventType === 'text') {
                // only text data is for sheet values
                if (emitSheet) {
                  if (current) {
                    current.text += value;
                  }
                }
              } else if (eventType === 'closetag') {
                const node = value;
                if (emitSheet) {
                  switch (node.name) {
                    case 'cols':
                      inCols = false;
                      _this2._columns = Column.fromModel(cols);
                      break;
                    case 'sheetData':
                      inRows = false;
                      break;
                    case 'row':
                      _this2._dimensions.expandRow(row);
                      worksheetEvents.push({
                        eventType: 'row',
                        value: row
                      });
                      row = null;
                      break;
                    case 'c':
                      if (row && c) {
                        const address = colCache.decodeAddress(c.ref);
                        const cell = row.getCell(address.col);
                        if (c.s) {
                          const style = styles.getStyleModel(c.s);
                          if (style) {
                            cell.style = style;
                          }
                        }
                        if (c.f) {
                          const cellValue = {
                            formula: c.f.text
                          };
                          if (c.v) {
                            if (c.t === 'str') {
                              cellValue.result = utils.xmlDecode(c.v.text);
                            } else {
                              cellValue.result = parseFloat(c.v.text);
                            }
                          }
                          cell.value = cellValue;
                        } else if (c.v) {
                          switch (c.t) {
                            case 's':
                              {
                                const index = parseInt(c.v.text, 10);
                                if (sharedStrings) {
                                  cell.value = sharedStrings[index];
                                } else {
                                  cell.value = {
                                    sharedString: index
                                  };
                                }
                                break;
                              }
                            case 'inlineStr':
                            case 'str':
                              cell.value = utils.xmlDecode(c.v.text);
                              break;
                            case 'e':
                              cell.value = {
                                error: c.v.text
                              };
                              break;
                            case 'b':
                              cell.value = parseInt(c.v.text, 10) !== 0;
                              break;
                            default:
                              if (utils.isDateFmt(cell.numFmt)) {
                                cell.value = utils.excelToDate(parseFloat(c.v.text), properties.model && properties.model.date1904);
                              } else {
                                cell.value = parseFloat(c.v.text);
                              }
                              break;
                          }
                        }
                        if (hyperlinks) {
                          const hyperlink = hyperlinks[c.ref];
                          if (hyperlink) {
                            cell.text = cell.value;
                            cell.value = undefined;
                            cell.hyperlink = hyperlink;
                          }
                        }
                        c = null;
                      }
                      break;
                    default:
                      break;
                  }
                }
                if (emitHyperlinks || hyperlinks) {
                  switch (node.name) {
                    case 'hyperlinks':
                      inHyperlinks = false;
                      break;
                    default:
                      break;
                  }
                }
              }
            }
            if (worksheetEvents.length > 0) {
              yield worksheetEvents;
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion3 && _iterator3.return != null) {
            yield _awaitAsyncGenerator(_iterator3.return());
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    })();
  }
}
module.exports = WorksheetReader;
//# sourceMappingURL=worksheet-reader.js.map
