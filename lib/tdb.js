var definitions = {}

const tdb = () => new Factory()

class Factory {
  constructor() {
    this._definitions = {}
  }

  make(typeToMake, explicitProperties) {
    var definition = this._definitions[typeToMake.name]
    if (!definition) {
      throw new UndefinedError(typeToMake.name)
    }
    var object = definition.buildInstance()
    definition.getDefaultProperties().merge(explicitProperties).assignTo(object)
    return object
  }

  define(typeToDefine, properties) {
    const definition = new Definition(typeToDefine).setDefaultProperties(properties)
    this._definitions[typeToDefine.name] = definition
    return definition
  }
}

class UndefinedError extends Error {
  constructor(type) {
    super(`Please use \`define\` to specify default attributes for a ${type}, before attempting to make one.`)
  }
}

tdb.Errors = { UndefinedError }

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
      return new this.type(this.getDefaultProperties().generateConstructorArgs(this.constructorArguments))
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

  generateConstructorArgs(args) {
    var newArgs = {}
    Object.keys(args).forEach((propertyName) => {
      newArgs[propertyName] = this._valueFor(propertyName, args)
    })
    return newArgs
  }

  assignTo(object) {
    Object.keys(this.properties).forEach((propertyName) => {
      object[propertyName] = this._valueFor(propertyName, this.properties)
    })
    return this
  }

  _valueFor(propertyName, data) {
    var value = data[propertyName]
    if (typeof(value) === 'function') {
      return value.call(this, this._sequenceFor(propertyName).next())
    }
    return value
  }

  _sequenceFor(propertyName) {
    if (!this.sequences[propertyName]) {
      this.sequences[propertyName] = new Sequence()
    }
    return this.sequences[propertyName]
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
