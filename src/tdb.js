'use strict'
Object.assign = require('object-assign')

class TestDataBuilder {
  constructor() {
    var defaults = {}

    this.make = {
      a: (typeToMake, explicitProperties) => {
        var result = new typeToMake()
        var properties = {}
        Object.assign(properties, defaults[typeToMake.name], explicitProperties)
        Object.keys(properties).forEach((key) => {
          var value = properties[key]
          if (typeof(value) === 'function') {
            result[key] = properties[key].call()
          } else {
            result[key] = properties[key]
          }
        })
        return result
      }
    }

    this.define = (typeToDefine) => {
      return {
        defaultProperties: (properties) => {
          defaults[typeToDefine.name] = properties
        }
      }
    }
  }
}

module.exports = new TestDataBuilder
