"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _asyncGeneratorDelegate(t) { var e = {}, n = !1; function pump(e, r) { return n = !0, r = new Promise(function (n) { n(t[e](r)); }), { done: !1, value: new _OverloadYield(r, 1) }; } return e["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function () { return this; }, e.next = function (t) { return n ? (n = !1, t) : pump("next", t); }, "function" == typeof t.throw && (e.throw = function (t) { if (n) throw n = !1, t; return pump("throw", t); }), "function" == typeof t.return && (e.return = function (t) { return n ? (n = !1, t) : pump("return", t); }), e; }
function _awaitAsyncGenerator(e) { return new _OverloadYield(e, 0); }
function _wrapAsyncGenerator(e) { return function () { return new AsyncGenerator(e.apply(this, arguments)); }; }
function AsyncGenerator(e) { var r, t; function resume(r, t) { try { var n = e[r](t), o = n.value, u = o instanceof _OverloadYield; Promise.resolve(u ? o.v : o).then(function (t) { if (u) { var i = "return" === r ? "return" : "next"; if (!o.k || t.done) return resume(i, t); t = e[i](t).value; } settle(n.done ? "return" : "normal", t); }, function (e) { resume("throw", e); }); } catch (e) { settle("throw", e); } } function settle(e, n) { switch (e) { case "return": r.resolve({ value: n, done: !0 }); break; case "throw": r.reject(n); break; default: r.resolve({ value: n, done: !1 }); } (r = r.next) ? resume(r.key, r.arg) : t = null; } this._invoke = function (e, n) { return new Promise(function (o, u) { var i = { key: e, arg: n, resolve: o, reject: u, next: null }; t ? t = t.next = i : (r = t = i, resume(e, n)); }); }, "function" != typeof e.return && (this.return = void 0); }
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; }, AsyncGenerator.prototype.next = function (e) { return this._invoke("next", e); }, AsyncGenerator.prototype.throw = function (e) { return this._invoke("throw", e); }, AsyncGenerator.prototype.return = function (e) { return this._invoke("return", e); };
function _OverloadYield(e, d) { this.v = e, this.k = d; }
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function (r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function () { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function (r) { var n = this.s.return; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, throw: function (r) { var n = this.s.return; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
const fs = require('fs');
const {
  EventEmitter
} = require('events');
const {
  PassThrough,
  Readable
} = require('readable-stream');
const nodeStream = require('stream');
const unzip = require('unzipper');
const tmp = require('tmp');
const iterateStream = require('../../utils/iterate-stream');
const parseSax = require('../../utils/parse-sax');
const StyleManager = require('../../xlsx/xform/style/styles-xform');
const WorkbookXform = require('../../xlsx/xform/book/workbook-xform');
const RelationshipsXform = require('../../xlsx/xform/core/relationships-xform');
const WorksheetReader = require('./worksheet-reader');
const HyperlinkReader = require('./hyperlink-reader');
tmp.setGracefulCleanup();
class WorkbookReader extends EventEmitter {
  constructor(input) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    this.input = input;
    this.options = _objectSpread({
      worksheets: 'emit',
      sharedStrings: 'cache',
      hyperlinks: 'ignore',
      styles: 'ignore',
      entries: 'ignore'
    }, options);
    this.styles = new StyleManager();
    this.styles.init();
  }
  _getStream(input) {
    if (input instanceof nodeStream.Readable || input instanceof Readable) {
      return input;
    }
    if (typeof input === 'string') {
      return fs.createReadStream(input);
    }
    throw new Error("Could not recognise input: ".concat(input));
  }
  async read(input, options) {
    try {
      var _iteratorAbruptCompletion = false;
      var _didIteratorError = false;
      var _iteratorError;
      try {
        for (var _iterator = _asyncIterator(this.parse(input, options)), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
          const {
            eventType,
            value
          } = _step.value;
          {
            switch (eventType) {
              case 'shared-strings':
                this.emit(eventType, value);
                break;
              case 'worksheet':
                this.emit(eventType, value);
                await value.read();
                break;
              case 'hyperlinks':
                this.emit(eventType, value);
                break;
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
      this.emit('end');
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
          const {
            eventType,
            value
          } = _step2.value;
          {
            if (eventType === 'worksheet') {
              yield value;
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
  parse(input, options) {
    var _this2 = this;
    return _wrapAsyncGenerator(function* () {
      if (options) _this2.options = options;
      const stream = _this2.stream = _this2._getStream(input || _this2.input);
      const zip = unzip.Parse({
        forceStream: true
      });
      stream.pipe(zip);

      // worksheets, deferred for parsing after shared strings reading
      const waitingWorkSheets = [];
      var _iteratorAbruptCompletion3 = false;
      var _didIteratorError3 = false;
      var _iteratorError3;
      try {
        for (var _iterator3 = _asyncIterator(iterateStream(zip)), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _awaitAsyncGenerator(_iterator3.next())).done; _iteratorAbruptCompletion3 = false) {
          const entry = _step3.value;
          {
            let match;
            let sheetNo;
            switch (entry.path) {
              case '_rels/.rels':
                break;
              case 'xl/_rels/workbook.xml.rels':
                yield _awaitAsyncGenerator(_this2._parseRels(entry));
                break;
              case 'xl/workbook.xml':
                yield _awaitAsyncGenerator(_this2._parseWorkbook(entry));
                break;
              case 'xl/sharedStrings.xml':
                yield* _asyncGeneratorDelegate(_asyncIterator(_this2._parseSharedStrings(entry)), _awaitAsyncGenerator);
                break;
              case 'xl/styles.xml':
                yield _awaitAsyncGenerator(_this2._parseStyles(entry));
                break;
              default:
                if (entry.path.match(/xl\/worksheets\/sheet\d+[.]xml/)) {
                  match = entry.path.match(/xl\/worksheets\/sheet(\d+)[.]xml/);
                  sheetNo = match[1];
                  if (_this2.sharedStrings && _this2.workbookRels) {
                    yield* _asyncGeneratorDelegate(_asyncIterator(_this2._parseWorksheet(iterateStream(entry), sheetNo)), _awaitAsyncGenerator);
                  } else {
                    // create temp file for each worksheet
                    yield _awaitAsyncGenerator(new Promise((resolve, reject) => {
                      tmp.file((err, path, fd, tempFileCleanupCallback) => {
                        if (err) {
                          return reject(err);
                        }
                        waitingWorkSheets.push({
                          sheetNo,
                          path,
                          tempFileCleanupCallback
                        });
                        const tempStream = fs.createWriteStream(path);
                        tempStream.on('error', reject);
                        entry.pipe(tempStream);
                        return tempStream.on('finish', () => {
                          return resolve();
                        });
                      });
                    }));
                  }
                } else if (entry.path.match(/xl\/worksheets\/_rels\/sheet\d+[.]xml.rels/)) {
                  match = entry.path.match(/xl\/worksheets\/_rels\/sheet(\d+)[.]xml.rels/);
                  sheetNo = match[1];
                  yield* _asyncGeneratorDelegate(_asyncIterator(_this2._parseHyperlinks(iterateStream(entry), sheetNo)), _awaitAsyncGenerator);
                }
                break;
            }
            entry.autodrain();
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
      for (const {
        sheetNo,
        path,
        tempFileCleanupCallback
      } of waitingWorkSheets) {
        let fileStream = fs.createReadStream(path);
        // TODO: Remove once node v8 is deprecated
        // Detect and upgrade old fileStreams
        if (!fileStream[Symbol.asyncIterator]) {
          fileStream = fileStream.pipe(new PassThrough());
        }
        yield* _asyncGeneratorDelegate(_asyncIterator(_this2._parseWorksheet(fileStream, sheetNo)), _awaitAsyncGenerator);
        tempFileCleanupCallback();
      }
    })();
  }
  _emitEntry(payload) {
    if (this.options.entries === 'emit') {
      this.emit('entry', payload);
    }
  }
  async _parseRels(entry) {
    const xform = new RelationshipsXform();
    this.workbookRels = await xform.parseStream(iterateStream(entry));
  }
  async _parseWorkbook(entry) {
    this._emitEntry({
      type: 'workbook'
    });
    const workbook = new WorkbookXform();
    await workbook.parseStream(iterateStream(entry));
    this.properties = workbook.map.workbookPr;
    this.model = workbook.model;
  }
  _parseSharedStrings(entry) {
    var _this3 = this;
    return _wrapAsyncGenerator(function* () {
      _this3._emitEntry({
        type: 'shared-strings'
      });
      switch (_this3.options.sharedStrings) {
        case 'cache':
          _this3.sharedStrings = [];
          break;
        case 'emit':
          break;
        default:
          return;
      }
      let text = null;
      let richText = [];
      let index = 0;
      let font = null;
      var _iteratorAbruptCompletion4 = false;
      var _didIteratorError4 = false;
      var _iteratorError4;
      try {
        for (var _iterator4 = _asyncIterator(parseSax(iterateStream(entry))), _step4; _iteratorAbruptCompletion4 = !(_step4 = yield _awaitAsyncGenerator(_iterator4.next())).done; _iteratorAbruptCompletion4 = false) {
          const events = _step4.value;
          {
            for (const {
              eventType,
              value
            } of events) {
              if (eventType === 'opentag') {
                const node = value;
                switch (node.name) {
                  case 'b':
                    font = font || {};
                    font.bold = true;
                    break;
                  case 'charset':
                    font = font || {};
                    font.charset = parseInt(node.attributes.charset, 10);
                    break;
                  case 'color':
                    font = font || {};
                    font.color = {};
                    if (node.attributes.rgb) {
                      font.color.argb = node.attributes.argb;
                    }
                    if (node.attributes.val) {
                      font.color.argb = node.attributes.val;
                    }
                    if (node.attributes.theme) {
                      font.color.theme = node.attributes.theme;
                    }
                    break;
                  case 'family':
                    font = font || {};
                    font.family = parseInt(node.attributes.val, 10);
                    break;
                  case 'i':
                    font = font || {};
                    font.italic = true;
                    break;
                  case 'outline':
                    font = font || {};
                    font.outline = true;
                    break;
                  case 'rFont':
                    font = font || {};
                    font.name = node.value;
                    break;
                  case 'si':
                    font = null;
                    richText = [];
                    text = null;
                    break;
                  case 'sz':
                    font = font || {};
                    font.size = parseInt(node.attributes.val, 10);
                    break;
                  case 'strike':
                    break;
                  case 't':
                    text = null;
                    break;
                  case 'u':
                    font = font || {};
                    font.underline = true;
                    break;
                  case 'vertAlign':
                    font = font || {};
                    font.vertAlign = node.attributes.val;
                    break;
                }
              } else if (eventType === 'text') {
                text = text ? text + value : value;
              } else if (eventType === 'closetag') {
                const node = value;
                switch (node.name) {
                  case 'r':
                    richText.push({
                      font,
                      text
                    });
                    font = null;
                    text = null;
                    break;
                  case 'si':
                    if (_this3.options.sharedStrings === 'cache') {
                      _this3.sharedStrings.push(richText.length ? {
                        richText
                      } : text);
                    } else if (_this3.options.sharedStrings === 'emit') {
                      yield {
                        index: index++,
                        text: richText.length ? {
                          richText
                        } : text
                      };
                    }
                    richText = [];
                    font = null;
                    text = null;
                    break;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion4 && _iterator4.return != null) {
            yield _awaitAsyncGenerator(_iterator4.return());
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    })();
  }
  async _parseStyles(entry) {
    this._emitEntry({
      type: 'styles'
    });
    if (this.options.styles === 'cache') {
      this.styles = new StyleManager();
      await this.styles.parseStream(iterateStream(entry));
    }
  }
  *_parseWorksheet(iterator, sheetNo) {
    this._emitEntry({
      type: 'worksheet',
      id: sheetNo
    });
    const worksheetReader = new WorksheetReader({
      workbook: this,
      id: sheetNo,
      iterator,
      options: this.options
    });
    const matchingRel = (this.workbookRels || []).find(rel => rel.Target === "worksheets/sheet".concat(sheetNo, ".xml"));
    const matchingSheet = matchingRel && (this.model.sheets || []).find(sheet => sheet.rId === matchingRel.Id);
    if (matchingSheet) {
      worksheetReader.id = matchingSheet.id;
      worksheetReader.name = matchingSheet.name;
      worksheetReader.state = matchingSheet.state;
    }
    if (this.options.worksheets === 'emit') {
      yield {
        eventType: 'worksheet',
        value: worksheetReader
      };
    }
  }
  *_parseHyperlinks(iterator, sheetNo) {
    this._emitEntry({
      type: 'hyperlinks',
      id: sheetNo
    });
    const hyperlinksReader = new HyperlinkReader({
      workbook: this,
      id: sheetNo,
      iterator,
      options: this.options
    });
    if (this.options.hyperlinks === 'emit') {
      yield {
        eventType: 'hyperlinks',
        value: hyperlinksReader
      };
    }
  }
}

// for reference - these are the valid values for options
WorkbookReader.Options = {
  worksheets: ['emit', 'ignore'],
  sharedStrings: ['cache', 'emit', 'ignore'],
  hyperlinks: ['cache', 'emit', 'ignore'],
  styles: ['cache', 'ignore'],
  entries: ['emit', 'ignore']
};
module.exports = WorkbookReader;
//# sourceMappingURL=workbook-reader.js.map
