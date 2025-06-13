"use strict";

function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function (r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function () { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function (r) { var n = this.s.return; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, throw: function (r) { var n = this.s.return; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
const parseSax = require('../../utils/parse-sax');
const XmlStream = require('../../utils/xml-stream');

/* 'virtual' methods used as a form of documentation */
/* eslint-disable class-methods-use-this */

// Base class for Xforms
class BaseXform {
  // constructor(/* model, name */) {}

  // ============================================================
  // Virtual Interface
  prepare(/* model, options */
  ) {
    // optional preparation (mutation) of model so it is ready for write
  }
  render(/* xmlStream, model */
  ) {
    // convert model to xml
  }
  parseOpen(node) {
    // XML node opened
  }
  parseText(text) {
    // chunk of text encountered for current node
  }
  parseClose(name) {
    // XML node closed
  }
  reconcile(model, options) {
    // optional post-parse step (opposite to prepare)
  }

  // ============================================================
  reset() {
    // to make sure parses don't bleed to next iteration
    this.model = null;

    // if we have a map - reset them too
    if (this.map) {
      Object.values(this.map).forEach(xform => {
        if (xform instanceof BaseXform) {
          xform.reset();
        } else if (xform.xform) {
          xform.xform.reset();
        }
      });
    }
  }
  mergeModel(obj) {
    // set obj's props to this.model
    this.model = Object.assign(this.model || {}, obj);
  }
  async parse(saxParser) {
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;
    var _iteratorError;
    try {
      for (var _iterator = _asyncIterator(saxParser), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
        const events = _step.value;
        {
          for (const {
            eventType,
            value
          } of events) {
            if (eventType === 'opentag') {
              this.parseOpen(value);
            } else if (eventType === 'text') {
              this.parseText(value);
            } else if (eventType === 'closetag') {
              if (!this.parseClose(value.name)) {
                return this.model;
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
    return this.model;
  }
  async parseStream(stream) {
    return this.parse(parseSax(stream));
  }
  get xml() {
    // convenience function to get the xml of this.model
    // useful for manager types that are built during the prepare phase
    return this.toXml(this.model);
  }
  toXml(model) {
    const xmlStream = new XmlStream();
    this.render(xmlStream, model);
    return xmlStream.xml;
  }

  // ============================================================
  // Useful Utilities
  static toAttribute(value, dflt) {
    let always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (value === undefined) {
      if (always) {
        return dflt;
      }
    } else if (always || value !== dflt) {
      return value.toString();
    }
    return undefined;
  }
  static toStringAttribute(value, dflt) {
    let always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return BaseXform.toAttribute(value, dflt, always);
  }
  static toStringValue(attr, dflt) {
    return attr === undefined ? dflt : attr;
  }
  static toBoolAttribute(value, dflt) {
    let always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (value === undefined) {
      if (always) {
        return dflt;
      }
    } else if (always || value !== dflt) {
      return value ? '1' : '0';
    }
    return undefined;
  }
  static toBoolValue(attr, dflt) {
    return attr === undefined ? dflt : attr === '1';
  }
  static toIntAttribute(value, dflt) {
    let always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return BaseXform.toAttribute(value, dflt, always);
  }
  static toIntValue(attr, dflt) {
    return attr === undefined ? dflt : parseInt(attr, 10);
  }
  static toFloatAttribute(value, dflt) {
    let always = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return BaseXform.toAttribute(value, dflt, always);
  }
  static toFloatValue(attr, dflt) {
    return attr === undefined ? dflt : parseFloat(attr);
  }
}
module.exports = BaseXform;
//# sourceMappingURL=base-xform.js.map
