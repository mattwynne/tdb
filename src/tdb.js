'use strict'
Object.assign = require('object-assign')

var defaults = {}
var sequences = {}

class TestDataBuilder {
  constructor() {

    this.make = {
      a: (typeToMake, explicitProperties) => {
        var result = new typeToMake()
        var properties = {}
        Object.assign(properties, defaults[typeToMake.name], explicitProperties)
        Object.keys(properties).forEach((key) => {
          var value = properties[key]
          if (typeof(value) === 'function') {
            result[key] = properties[key].call(this, nextSequence(typeToMake, key))
          } else {
            result[key] = properties[key]
          }
        })
        return result
      }
    }

    this.define = (typeToDefine, properties) => {
      defaults[typeToDefine.name] = properties
      return this
    }

    var nextSequence = (key) => {
      if (!sequences[key]) {
        sequences[key] = 0
      }
      sequences[key] = sequences[key] + 1
      return sequences[key]
    }
  }
}

module.exports = new TestDataBuilder

// Plug into jasmine/mocha to reset state between each test
if (typeof beforeEach === 'function') {
  beforeEach(function () {
    defaults = {};
    sequences = {};
  });
}
