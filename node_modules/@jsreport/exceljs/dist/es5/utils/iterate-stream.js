"use strict";

function _awaitAsyncGenerator(e) { return new _OverloadYield(e, 0); }
function _wrapAsyncGenerator(e) { return function () { return new AsyncGenerator(e.apply(this, arguments)); }; }
function AsyncGenerator(e) { var r, t; function resume(r, t) { try { var n = e[r](t), o = n.value, u = o instanceof _OverloadYield; Promise.resolve(u ? o.v : o).then(function (t) { if (u) { var i = "return" === r ? "return" : "next"; if (!o.k || t.done) return resume(i, t); t = e[i](t).value; } settle(n.done ? "return" : "normal", t); }, function (e) { resume("throw", e); }); } catch (e) { settle("throw", e); } } function settle(e, n) { switch (e) { case "return": r.resolve({ value: n, done: !0 }); break; case "throw": r.reject(n); break; default: r.resolve({ value: n, done: !1 }); } (r = r.next) ? resume(r.key, r.arg) : t = null; } this._invoke = function (e, n) { return new Promise(function (o, u) { var i = { key: e, arg: n, resolve: o, reject: u, next: null }; t ? t = t.next = i : (r = t = i, resume(e, n)); }); }, "function" != typeof e.return && (this.return = void 0); }
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; }, AsyncGenerator.prototype.next = function (e) { return this._invoke("next", e); }, AsyncGenerator.prototype.throw = function (e) { return this._invoke("throw", e); }, AsyncGenerator.prototype.return = function (e) { return this._invoke("return", e); };
function _OverloadYield(e, d) { this.v = e, this.k = d; }
module.exports = /*#__PURE__*/function () {
  var _iterateStream = _wrapAsyncGenerator(function* (stream) {
    const contents = [];
    stream.on('data', data => contents.push(data));
    let resolveStreamEndedPromise;
    const streamEndedPromise = new Promise(resolve => resolveStreamEndedPromise = resolve);
    let ended = false;
    stream.on('end', () => {
      ended = true;
      resolveStreamEndedPromise();
    });
    let error = false;
    stream.on('error', err => {
      error = err;
      resolveStreamEndedPromise();
    });
    while (!ended || contents.length > 0) {
      if (contents.length === 0) {
        stream.resume();
        // eslint-disable-next-line no-await-in-loop
        yield _awaitAsyncGenerator(Promise.race([once(stream, 'data'), streamEndedPromise]));
      } else {
        stream.pause();
        const data = contents.shift();
        yield data;
      }
      if (error) throw error;
    }
    resolveStreamEndedPromise();
  });
  function iterateStream(_x) {
    return _iterateStream.apply(this, arguments);
  }
  return iterateStream;
}();
function once(eventEmitter, type) {
  // TODO: Use require('events').once when node v10 is dropped
  return new Promise(resolve => {
    let fired = false;
    const handler = () => {
      if (!fired) {
        fired = true;
        eventEmitter.removeListener(type, handler);
        resolve();
      }
    };
    eventEmitter.addListener(type, handler);
  });
}
//# sourceMappingURL=iterate-stream.js.map
