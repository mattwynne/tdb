'use strict'
Object.assign = require('object-assign')

var sequences = {}
var definitions = {}

class Definition {
  constructor(type) {
    this.type = type
    this.defaults = {}
  }

  setDefaultProperties(properties) {
    this.defaults = properties
    return this
  }

  constructWith(constructorArguments) {
    this.constructorArguments = constructorArguments
    return this
  }

  defaultProperties() {
    return new Properties(this.defaults)
  }

  build() {
    if (this.constructorArguments) {
      return new this.type(this.constructorArguments)
    }
    return new this.type()
  }
}

class TestDataBuilder {
  constructor() {
    var self = this

    this.make = {
      a: (typeToMake, explicitProperties) => {
        var object = definitions[typeToMake.name].build()
        definitions[typeToMake.name].defaultProperties().merge(explicitProperties).assignTo(object)
        return object
      }
    }

    this.define = (typeToDefine, properties) => {
      return definitions[typeToDefine.name] = new Definition(typeToDefine).setDefaultProperties(properties)
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

    Object.keys(this.properties).forEach((propertyName) => {
      object[propertyName] = valueFor(propertyName)
    })
    return this

    function valueFor(propertyName) {
      var value = self.properties[propertyName]
      if (typeof(value) === 'function') {
        return value.call(self, nextSequence(object.constructor.name, propertyName))
      }
      return value
    }

    function nextSequence(propertyName) {
      if (!sequences[propertyName]) { sequences[propertyName] = 0 }
      sequences[propertyName] = sequences[propertyName] + 1
      return sequences[propertyName]
    }
  }
}

module.exports = new TestDataBuilder

// Plug into jasmine/mocha to reset state between each test
if (typeof beforeEach === 'function') {
  beforeEach(function () {
    definitions = {};
    sequences = {};
  });
}
