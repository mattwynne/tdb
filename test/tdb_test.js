'use strict'
const expect = require('chai').expect
const tdb = require('../lib/tdb')
const make = tdb.make
const define = tdb.define

describe('tdb', () => {
  let factory

  beforeEach(function () {
    factory = tdb()
  })

  class ThingToMake {
    constructor() {
      this.name = "NO NAME!"
    }
  }

  context('default properties', () => {

    beforeEach(() => {
      factory.define(ThingToMake, {
        name: "Nemo"
      })
    })

    it('uses default property values if no properties specified', () => {
      var madeThing = factory.make(ThingToMake)
      expect(madeThing.name).to.equal('Nemo')
    })

  })

  context('explicit properties', () => {

    beforeEach(() => {
      factory.define(ThingToMake, {
        name: "Nemo"
      })
    })

    it('overrides default values with explicit properties', () => {
      var madeThing = factory.make(ThingToMake, { name: "Dave" })
      expect(madeThing.name).to.equal('Dave')
    })

  })

  context('lazy default properties', () => {

    beforeEach(() => {
      factory.define(ThingToMake, {
        name: () => { return 'Lazy name' }
      })
    })

    it('uses the evaluated lazy default property value when no properties specified', () => {
      var madeThing = factory.make(ThingToMake)
      expect(madeThing.name).to.equal('Lazy name')
    })
  })

  context('sequences', () => {

    beforeEach(() => {
      factory.define(ThingToMake, {
        name: (n) => { return `Thing name ${n}` }
      })
    })

    it('increments the sequence number each time it builds', () => {
      var madeThingOne = factory.make(ThingToMake)
      expect(madeThingOne.name).to.equal('Thing name 1')

      var madeThingTwo = factory.make(ThingToMake)
      expect(madeThingTwo.name).to.equal('Thing name 2')
    })
  })

  context('constructor arguments', () => {
    class ValidatedThingToMake {
      constructor(attributes) {
        if (!attributes.name) {
          throw new Error('name attribute is mandatory')
        }
        this.name = attributes.name
      }
    }

    it('uses the defined constructor arguments when given', () => {
      factory.define(ValidatedThingToMake).constructWith({ name: 'Constructed name' })
      var madeThing = factory.make(ValidatedThingToMake)
      expect(madeThing.name).to.equal('Constructed name')
    })

    it('can use sequences in constructor arguments', () => {
      factory.define(ValidatedThingToMake).constructWith({
        name: (n) => `Constructed name ${n}`
      })
      var madeThing = factory.make(ValidatedThingToMake)
      expect(madeThing.name).to.equal('Constructed name 1')
    })
  })

  context('user errors', () => {
    class NewThingToMake {}

    var UndefinedError = tdb.Errors.UndefinedError

    it("it raises an error when asked to make a type that hasn't been defined", () => {
      expect(() => { factory.make(NewThingToMake) }).to.throw(UndefinedError,
        'Please use `define` to specify default attributes for a NewThingToMake, before attempting to make one.')
    })
  })

})
