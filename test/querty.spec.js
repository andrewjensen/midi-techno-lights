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
    
})
