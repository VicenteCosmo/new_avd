"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable max-classes-per-file */
const BaseXform = require('../base-xform');
const utils = require('../../../utils/utils');
const ColorXform = require('./color-xform');
class EdgeXform extends BaseXform {
  constructor(name) {
    super();
    this.name = name;
    this.map = {
      color: new ColorXform()
    };
  }
  get tag() {
    return this.name;
  }
  render(xmlStream, model, defaultColor) {
    const color = model && model.color || defaultColor || this.defaultColor;
    xmlStream.openNode(this.name);
    if (model && model.style) {
      xmlStream.addAttribute('style', model.style);
      if (color) {
        this.map.color.render(xmlStream, color);
      }
    }
    xmlStream.closeNode();
  }
  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.name:
        {
          const {
            style
          } = node.attributes;
          if (style) {
            this.model = {
              style
            };
          } else {
            this.model = undefined;
          }
          return true;
        }
      case 'color':
        this.parser = this.map.color;
        this.parser.parseOpen(node);
        return true;
      default:
        return false;
    }
  }
  parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  }
  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }
      return true;
    }
    if (name === this.name) {
      if (this.map.color.model) {
        if (!this.model) {
          this.model = {};
        }
        this.model.color = this.map.color.model;
      }
    }
    return false;
  }
  validStyle(value) {
    return EdgeXform.validStyleValues[value];
  }
}
EdgeXform.validStyleValues = ['thin', 'dashed', 'dotted', 'dashDot', 'hair', 'dashDotDot', 'slantDashDot', 'mediumDashed', 'mediumDashDotDot', 'mediumDashDot', 'medium', 'double', 'thick'].reduce((p, v) => {
  p[v] = true;
  return p;
}, {});

// Border encapsulates translation from border model to/from xlsx
class BorderXform extends BaseXform {
  constructor() {
    super();
    this.map = {
      top: new EdgeXform('top'),
      left: new EdgeXform('left'),
      bottom: new EdgeXform('bottom'),
      right: new EdgeXform('right'),
      diagonal: new EdgeXform('diagonal')
    };
  }
  render(xmlStream, model) {
    const {
      color
    } = model;
    xmlStream.openNode('border');
    if (model.diagonal && model.diagonal.style) {
      if (model.diagonal.up) {
        xmlStream.addAttribute('diagonalUp', '1');
      }
      if (model.diagonal.down) {
        xmlStream.addAttribute('diagonalDown', '1');
      }
    }
    function add(edgeModel, edgeXform) {
      if (edgeModel && !edgeModel.color && model.color) {
        // don't mess with incoming models
        edgeModel = _objectSpread(_objectSpread({}, edgeModel), {}, {
          color: model.color
        });
      }
      edgeXform.render(xmlStream, edgeModel, color);
    }
    add(model.left, this.map.left);
    add(model.right, this.map.right);
    add(model.top, this.map.top);
    add(model.bottom, this.map.bottom);
    add(model.diagonal, this.map.diagonal);
    xmlStream.closeNode();
  }
  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case 'border':
        this.reset();
        this.diagonalUp = utils.parseBoolean(node.attributes.diagonalUp);
        this.diagonalDown = utils.parseBoolean(node.attributes.diagonalDown);
        return true;
      default:
        this.parser = this.map[node.name];
        if (this.parser) {
          this.parser.parseOpen(node);
          return true;
        }
        return false;
    }
  }
  parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  }
  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }
      return true;
    }
    if (name === 'border') {
      const model = this.model = {};
      const add = function (key, edgeModel, extensions) {
        if (edgeModel) {
          if (extensions) {
            Object.assign(edgeModel, extensions);
          }
          model[key] = edgeModel;
        }
      };
      add('left', this.map.left.model);
      add('right', this.map.right.model);
      add('top', this.map.top.model);
      add('bottom', this.map.bottom.model);
      add('diagonal', this.map.diagonal.model, {
        up: this.diagonalUp,
        down: this.diagonalDown
      });
    }
    return false;
  }
}
module.exports = BorderXform;
//# sourceMappingURL=border-xform.js.map
