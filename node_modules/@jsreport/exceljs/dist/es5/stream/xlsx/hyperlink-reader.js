"use strict";

function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function (r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function () { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function (r) { var n = this.s.return; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, throw: function (r) { var n = this.s.return; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
const {
  EventEmitter
} = require('events');
const parseSax = require('../../utils/parse-sax');
const Enums = require('../../doc/enums');
const RelType = require('../../xlsx/rel-type');
class HyperlinkReader extends EventEmitter {
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
    this.options = options;
  }
  get count() {
    return this.hyperlinks && this.hyperlinks.length || 0;
  }
  each(fn) {
    return this.hyperlinks.forEach(fn);
  }
  async read() {
    const {
      iterator,
      options
    } = this;
    let emitHyperlinks = false;
    let hyperlinks = null;
    switch (options.hyperlinks) {
      case 'emit':
        emitHyperlinks = true;
        break;
      case 'cache':
        this.hyperlinks = hyperlinks = {};
        break;
      default:
        break;
    }
    if (!emitHyperlinks && !hyperlinks) {
      this.emit('finished');
      return;
    }
    try {
      var _iteratorAbruptCompletion = false;
      var _didIteratorError = false;
      var _iteratorError;
      try {
        for (var _iterator = _asyncIterator(parseSax(iterator)), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
          const events = _step.value;
          {
            for (const {
              eventType,
              value
            } of events) {
              if (eventType === 'opentag') {
                const node = value;
                if (node.name === 'Relationship') {
                  const rId = node.attributes.Id;
                  switch (node.attributes.Type) {
                    case RelType.Hyperlink:
                      {
                        const relationship = {
                          type: Enums.RelationshipType.Styles,
                          rId,
                          target: node.attributes.Target,
                          targetMode: node.attributes.TargetMode
                        };
                        if (emitHyperlinks) {
                          this.emit('hyperlink', relationship);
                        } else {
                          hyperlinks[relationship.rId] = relationship;
                        }
                      }
                      break;
                    default:
                      break;
                  }
                }
              }
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
}
module.exports = HyperlinkReader;
//# sourceMappingURL=hyperlink-reader.js.map
