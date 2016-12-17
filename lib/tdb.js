'use strict'
Object.assign = require('object-assign')

var definitions = {}

const tdb = {}

tdb.make = (typeToMake, explicitProperties) => {
  var definition = definitions[typeToMake.name]
  if (!definition) {
    throw new UndefinedError(typeToMake.name)
  }
  var object = definition.buildInstance()
  definition.getDefaultProperties().merge(explicitProperties).assignTo(object)
  return object
}
tdb.make.a = tdb.make

tdb.define = (typeToDefine, properties) => {
  return definitions[typeToDefine.name] = new Definition(typeToDefine).setDefaultProperties(properties)
}

class UndefinedError extends Error {}

tdb.Errors = {}
tdb.Errors.UndefinedError = UndefinedError

class Definition {
  constructor(type) {
    this.type = type
    this.defaults = {}
    this.sequences = {}
  }

  setDefaultProperties(properties) {
    this.defaults = properties
    return this
  }

  constructWith(constructorArguments) {
    this.constructorArguments = constructorArguments
    return this
  }

  getDefaultProperties() {
    return new Properties(this.defaults, this.sequences)
  }

  buildInstance() {
    if (this.constructorArguments) {
      return new this.type(this.constructorArguments)
    }
    return new this.type()
  }
}

class Properties {
  constructor(defaultProperties, sequences) {
    this.properties = {}
    this.defaultProperties = defaultProperties
    this.sequences = sequences
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
        return value.call(self, sequenceFor(propertyName).next())
      }
      return value
    }

    function sequenceFor(propertyName) {
      if (!self.sequences[propertyName]) {
        self.sequences[propertyName] = new Sequence()
      }
      return self.sequences[propertyName]
    }
  }
}

class Sequence {
  constructor() {
    this.value = 0
  }

  next() {
    this.value ++
    return this.value
  }
}

module.exports = tdb

// Plug into jasmine/mocha to reset state between each test
if (typeof beforeEach === 'function') {
  beforeEach(function () {
    definitions = {};
  });
}
