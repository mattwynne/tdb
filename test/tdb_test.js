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

  define(ThingToMake, {
    name: "Nemo"
  })

  it('uses default property values if no properties specified', (callback) => {
    var madeThing = make.a(ThingToMake)
    expect(madeThing.name).to.equal('Nemo')
    callback()
  })
})
