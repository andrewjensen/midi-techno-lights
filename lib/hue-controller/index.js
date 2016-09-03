'use strict';

var hue = require("node-hue-api");
var HueApi = hue.HueApi;


class hue_controller {

    constructor() {
        console.log("In the constructor")
        this.lightState = hue.lightState.create();
    }

    start() {
        this.startPromise = new Promise((resolve, reject) => {
            this.resolveStart = resolve;
            this.rejectStart = reject;

            hue.nupnpSearch()
                .then(this.chooseBridge.bind(this))
        })
        return this.startPromise;
	}

    chooseBridge(bridges) {
        console.log(JSON.stringify(bridges))
        let hubIp = bridges[0].ipaddress
        let username = "154314a018d14f8f316170f0eaebf7f"   // preconfigured with this hub

        this.api = new HueApi(hubIp, username)
        this.api.setLightState(4, this.lightState.transitionInstant())
        this.resolveStart()
    }

    getConfig() {
        return this.api.getConfig();
    }

    setRgb(r, g, b) {
        let state = this.lightState.rgb(r, g, b)
        return this.api.setLightState(4, state)    // We have light 4 for some reason.
    }

    turnOn() {
        let state = this.lightState.on()
        return this.api.setLightState(4, state)
    }

    turnOff() {
        let state = this.lightState.off()
        return this.api.setLightState(4, state)
    }

}


module.exports = hue_controller