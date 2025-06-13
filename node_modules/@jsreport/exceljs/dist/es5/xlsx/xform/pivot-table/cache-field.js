"use strict";

class CacheField {
  constructor(_ref) {
    let {
      name,
      sharedItems
    } = _ref;
    // string type
    //
    // {
    //   'name': 'A',
    //   'sharedItems': ['a1', 'a2', 'a3']
    // }
    //
    // or
    //
    // integer type
    //
    // {
    //   'name': 'D',
    //   'sharedItems': null
    // }
    this.name = name;
    this.sharedItems = sharedItems;
  }
  render() {
    // PivotCache Field: http://www.datypic.com/sc/ooxml/e-ssml_cacheField-1.html
    // Shared Items: http://www.datypic.com/sc/ooxml/e-ssml_sharedItems-1.html

    // integer types
    if (this.sharedItems === null) {
      // TK(2023-07-18): left out attributes... minValue="5" maxValue="45"
      return "<cacheField name=\"".concat(this.name, "\" numFmtId=\"0\">\n      <sharedItems containsSemiMixedTypes=\"0\" containsString=\"0\" containsNumber=\"1\" containsInteger=\"1\" />\n    </cacheField>");
    }

    // string types
    return "<cacheField name=\"".concat(this.name, "\" numFmtId=\"0\">\n      <sharedItems count=\"").concat(this.sharedItems.length, "\">\n        ").concat(this.sharedItems.map(item => "<s v=\"".concat(item, "\" />")).join(''), "\n      </sharedItems>\n    </cacheField>");
  }
}
module.exports = CacheField;
//# sourceMappingURL=cache-field.js.map
