'use strict'
Object.assign = require('object-assign')

var defaults = {}
var sequences = {}

class TestDataBuilder {
  constructor() {

    this.make = {
      a: (typeToMake, explicitProperties) => {
        var object = new typeToMake()
        new Properties(defaults[typeToMake.name]).merge(explicitProperties).assignTo(object)
        return object
      }
    }

    this.define = (typeToDefine, properties) => {
      defaults[typeToDefine.name] = properties
      return this
    }

  }
}

class Properties {
  constructor(defaultProperties) {
    this.properties = {}
    this.defaultProperties = defaultProperties
  }

  merge(explicitProperties) {
    Object.assign(this.properties, this.defaultProperties, explicitProperties)
    return this
  }

  assignTo(object) {
    var self = this

    Object.keys(this.properties).forEach((key) => {
      object[key] = valueFor(key)
    })
    return this

    function valueFor(propertyName) {
      var value = self.properties[propertyName]
      if (typeof(value) === 'function') {
        return value.call(self, nextSequence(object.constructor.name, propertyName))
      }
      return value
    }

    function nextSequence(key) {
      if (!sequences[key]) { sequences[key] = 0 }
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
