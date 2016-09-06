'use strict';

class querty {
    constructor () {
        this.current = null;
        this.queue = [];
    }

    // private function
    _exec(fn) {
        if(this.current)
            throw new Error("Shouldn't exec while something is executing");

        console.log("Querty exec")
        this.current = fn
        fn().then(() => {
            console.log("Querty resolved")
            this.current = null
            if(this.queue.length > 0) {
                let newitem = this.queue.shift();

                // Start the new item on a 0 ms timer to get it off the stack.
                // Otherwise this just turns into a recursive call that eventually blows up the stack.
                setTimeout(() => {
                    this._exec(newitem)
                }, 0);
            }
        })
    }

    push(fn) {
        // If there is something active, then push this on the end of the array.
        if(this.current) {
            console.log("Querty appending")
            this.queue.push(fn)
        }
        else {
        // If there's nothing active, then start this function.
            console.log("Querty started")
            this._exec(fn)
        }
    }
}

module.exports = querty;