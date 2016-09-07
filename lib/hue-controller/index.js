'use strict';

var hue = require("node-hue-api");
var HueApi = hue.HueApi;

class hue_light {
    constructor(api, lightState, lightIdx) {
        this.api = api
        this.lightState = lightState
        this.lightIdx = lightIdx

        this.api.setLightState(this.lightIdx, this.lightState.transitionInstant())
        this.api.setLightState(this.lightIdx, this.lightState.bri(255))
    }

    setRgb(r, g, b) {
        let state = this.lightState.rgb(r, g, b)
        return this.api.setLightState(this.lightIdx, state)    // We have light 4 for some reason.
    }

    turnOn() {
        let state = this.lightState.on()
        return this.api.setLightState(this.lightIdx, state)
    }

    turnOff() {
        let state = this.lightState.off()
        return this.api.setLightState(this.lightIdx, state)
    }

}

class hue_controller {

    constructor() {
        console.log("In the constructor")
    }

    start() {
        let p = new Promise((resolve, reject) => {
            this.resolveStart = resolve;
            this.rejectStart = reject;

            hue.nupnpSearch()
                .then(this.chooseBridge.bind(this))
        })
        return p;
	}

    chooseBridge(bridges) {
//        console.log(JSON.stringify(bridges))
        let hubIp = bridges[0].ipaddress
        let username = "154314a018d14f8f316170f0eaebf7f"   // preconfigured with this hub

        this.api = new HueApi(hubIp, username)
        this.api.lights()
            .then(this.listLights.bind(this))
    }

    listLights(lights) {
        let ret = []

        for(var item of lights.lights) {
            if(item.state.reachable) {
                let lightState = hue.lightState.create();
                ret.push(new hue_light(this.api, lightState, item.id))
            }
        }
        this.resolveStart(ret)
    }

    getConfig() {
        return this.api.getConfig();
    }

}


module.exports = hue_controller