'use strict';

let chai = require('chai')
let assert = chai.assert;

describe('querty promise-based function queueing', function (){
    let querty = new (require("../lib/querty"))()
    let previousVal = 0;

    function testConsecutive(num) {
        let p = new Promise((resolve, reject) => {

            assert.equal(previousVal + 1, num)
            previousVal = num
            resolve(num)
        })
        return p;
    }

    function checkResults(expected, done) {
        let p = new Promise((resolve, reject) => {
            assert.equal(previousVal, expected)
            resolve()
            done()
        })
        return p;
    }

    function testSomeDelay(delay, num) {
        let p = new Promise((resolve, reject) => {

            setTimeout((num) => {
                resolve(num)
            }, delay, num)
        })
        return p;
    }


    it('should queue a function call', function(done) {
        querty.push(testConsecutive.bind(this, 1));
        done()
    })

    it('should queue another function call', function(done) {
        querty.push(testConsecutive.bind(this, 2));
        done()
    })

    it('should queue a whole bunch of functions', function(done) {

        let limit = 150
        for(var i = 3; i <= limit; i++) {
            querty.push(testConsecutive.bind(this, i));            
        }
        querty.push(checkResults.bind(this, limit, done))
    })

    it('should wait for a promise from each function call', function(done) {

        // Pass in a value to be consumed in the bound function (the delay)
        // and also a value that should be returned back after the delay through the promise chain
        // Make sure the delay was at least the amount specified
        // And make sure the value came back.
        let val = 376892
        let delay = 250
        let start = new Date()
        querty.push(testSomeDelay.bind(this, 250, val))
            .then((data) => {
                let end = new Date()
                let elapsed = end - start
                assert.isAtLeast(elapsed, delay)
                assert.equal(data, val)
                done()
            })
    })
    
    
})
