'use strict'
const expect = require('chai').expect
const tdb = require('../src/tdb')
const make = tdb.make
const define = tdb.define

describe('tdb', () => {

  class ThingToMake {
    constructor() {
      this.name = "NO NAME!"
    }
  }

  context('default properties', () => {

    beforeEach(() => {
      define(ThingToMake).defaultProperties({
        name: "Nemo"
      })
    })

    it('uses default property values if no properties specified', () => {
      var madeThing = make.a(ThingToMake)
      expect(madeThing.name).to.equal('Nemo')
    })

    it('overrides default values with explicit properties', () => {
      var madeThing = make.a(ThingToMake, { name: "Dave" })
      expect(madeThing.name).to.equal('Dave')
    })

  })

  context('lazy default properties', () => {

    beforeEach(() => {
      define(ThingToMake).defaultProperties({
        name: () => { return 'Lazy name' }
      })
    })

    it('uses the evaluated lazy default property value when no properties specified', () => {
      var madeThing = make.a(ThingToMake)
      expect(madeThing.name).to.equal('Lazy name')
    })
  })

})
