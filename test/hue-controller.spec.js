'use strict';
let assert = require('chai').assert;


describe('hue lights controller', function (){
    let controller = new (require("../lib/hue-controller"))()
    let hue_lights = []
    let querty = new (require("../lib/querty"))()

    function nullFunction() {
        let p = new Promise((resolve, reject) => {
            resolve()
        })
        return p;
    }

    before(function(done){
        this.timeout(10000)
       let startPromise = controller.start()
        .then((lights) => {
            hue_lights = lights
            assert(hue_lights.length > 0)

            // The API isn't supposed to require this, but if you don't have a little delay,
            // then you'll get ECONNRESET back from the API sometimes.
            setTimeout(() => {
                done()
            }, 100)
        })
    })

   it('should return config info', function(done) {
        querty.push(controller.getConfig.bind(controller))
            .then((data) => {
                assert.equal(data.name, "Philips hue")
                done()
            })
   })

   it('should turn on the lights', function(done) {
       for(var item of hue_lights) {
            querty.push(item.turnOn.bind(item));
            querty.push(item.setRgb.bind(item, 255, 0, 0))
            querty.push(item.setRgb.bind(item, 0, 255, 0))
            querty.push(item.setRgb.bind(item, 0, 0, 255))
       }
        querty.push(nullFunction).then(() => { done() })
   })

   it.skip('should set colors on a light', function(done) {
       for(var item of hue_lights) {
           querty.push(item.setRgb.bind(item, 255, 0, 0))
           querty.push(item.setRgb.bind(item, 0, 0, 255))
       }
        querty.push(nullFunction).then(() => { done() })
   })

   it('should turn off a light', function(done) {
       for(var item of hue_lights) {
            querty.push(item.turnOff.bind(item));
       }
        querty.push(nullFunction).then(() => { done() })
 })

})