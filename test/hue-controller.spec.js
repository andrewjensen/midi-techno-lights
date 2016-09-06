'use strict';
let assert = require('chai').assert;


describe('hue lights controller', function (){
    let controller = new (require("../lib/hue-controller"))()
    let hue_lights = []
    let querty = new (require("../lib/querty"))()

    function finishTest(done) {
        let p = new Promise((resolve, reject) => {
            console.log("Test is complete")
            resolve()
            done()
        })
        return p;
    }

    before(function(done){     
       let startPromise = controller.start()
        .then((lights) => {
            hue_lights = lights
            console.log(hue_lights.length)
            assert(hue_lights.length > 0)
            setTimeout(() => {
                done()
            }, 4000)
        })
    })

   it('should return config info', function(done) {

       // I really want a way to ask querty to call something before moving on to the next
       // thing in the queue.
        querty.push(controller.getConfig.bind(controller));
/*
            .then((data) => {
                console.log(JSON.stringify(data))
                data.name.should.eql("Philips hue")
                done()
            })
*/
        querty.push(finishTest.bind(this, done))
   })

   it('should turn on the lights', function(done) {
       console.log("getting started")
       for(var item of hue_lights) {
            querty.push(item.turnOn.bind(item));
            querty.push(item.setRgb.bind(item, 255, 0, 0))
            querty.push(item.setRgb.bind(item, 0, 255, 0))
            querty.push(item.setRgb.bind(item, 0, 0, 255))
       }
       console.log("Pushed the batch")
        querty.push(finishTest.bind(this, done))
       console.log("Pushed the finish event")
   })

   it.skip('should set colors on a light', function(done) {
       console.log("Second test")
       for(var item of hue_lights) {
           querty.push(item.setRgb.bind(item, 255, 0, 0))
           querty.push(item.setRgb.bind(item, 0, 0, 255))
       }
        querty.push(finishTest.bind(this, done))
   })

   it('should turn off a light', function(done) {
       for(var item of hue_lights) {
            querty.push(item.turnOff.bind(item));
       }
        querty.push(finishTest.bind(this, done))
   })

})