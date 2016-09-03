'use strict';

let chai = require('chai')
let should = chai.should();

describe('hue lights controller', function (){
    let controller = new (require("../lib/hue-controller"))()
    let lights = []

    before(function(done){     
       let startPromise = controller.start()
        .then((lights) => {
            let val = {test: true}
            val.test.should.exist
            done()
        })
    })

   it('should construct and start', function() {
       console.log("I am in the first test")
   })

   it('should return config info', function(done) {
       controller.getConfig()
        .then((data) => {
            console.log(JSON.stringify(data))
            data.name.should.eql("Philips hue")
            done()
        })
   })

   it('should turn on a light', function(done) {
       controller.turnOn()
        .then(() => {
            done()
        })
   })

   it('should set colors on a light', function(done) {
       controller.setRgb(255, 0, 0)
        .then(() => {
            setTimeout(() => {
                controller.setRgb(0, 255, 0)
                done()
            }, 100)
        })
   })

   it('should turn off a light', function(done) {
       controller.turnOff()
        .then(() => {
            done()
        })
   })

})