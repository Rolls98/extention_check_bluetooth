const noble = require("noble");

console.log("Start to scanning...");

noble.on('stateChange', callback)

noble.startScanning();


function callback(state) {

    console.log("state ", state);

}
