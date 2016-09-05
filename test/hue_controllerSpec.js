'use strict';

let chai = require('chai')
let should = chai.should();

describe('hue lights controller', function (){
    let controller = new (require("../lib/hue-controller"))()
    let hue_lights = []

    before(function(done){     
       let startPromise = controller.start()
        .then((lights) => {
            hue_lights = lights
            hue_lights.length.should.be.above(0)
            done()
        })
    })
/*
   it('should return config info', function(done) {
        controller.getConfig()
            .then((data) => {
                console.log(JSON.stringify(data))
                data.name.should.eql("Philips hue")
                done()
            })
   })
*/
   it('should turn on a light', function(done) {
       let promises = [];

       for(var item of hue_lights) {
           let p = new Promise((resolve, reject) => {
                item.turnOn()
                .then(() => {
                    item.setRgb(0, 255, 0)
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
           })
           promises.push(p)
       }
       Promise.all(promises)
       .then(() => {
           done()
        })
   })
/*
   it('should set colors on a light', function(done) {
       for(var item of hue_lights) {
        item.setRgb(255, 0, 0)
            .then(() => {
                setTimeout(() => {
                    item.setRgb(0, 255, 0)
                    done()
                }, 100)
            })
       }
   })

   it('should turn off a light', function(done) {
       for(var item of hue_lights) {
        item.turnOff()
            .then(() => {
                done()
            })
       }
   })
*/
})