'use strict';

class QueueItem {
    constructor(fn, resolve, reject) {
        this.fn = fn
        this.resolve = resolve
        this.reject = reject
    }
}


class querty {

    constructor () {
        this.current = null;
        this.queue = [];
    }

    // private function
    _exec(item) {
        if(this.current)
            throw new Error("Shouldn't exec while something is executing");

        this.current = item
        item.fn()
            .then((data) => {
                item.resolve(data)

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
            .catch((err) => {
                item.reject(err)
            })
    }

    push(fn) {

        let p = new Promise ((resolve, reject) => {
            let item = new QueueItem(fn, resolve, reject)            

            // If there is something active, then push this on the end of the array.
            if(this.current) {
                this.queue.push(item)
            }
            else {
            // If there's nothing active, then start this function.
                this._exec(item)
            }
        })
        return p
    }

}

module.exports = querty;