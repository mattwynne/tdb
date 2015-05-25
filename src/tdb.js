'use strict'

class TestDataBuilder {
  constructor() {
    var defaults = {}

    this.make = {
      a: (typeToMake) => {
        var result = new typeToMake()
        var properties = defaults[typeToMake.name]
        Object.keys(properties).forEach((key) => {
          result[key] = properties[key]
        })
        return result
      }
    }

    this.define = (typeToDefine, properties) => {
      defaults[typeToDefine.name] = properties
    }
  }
}

module.exports = new TestDataBuilder
