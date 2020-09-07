// let btn = document.querySelector("#active");
// let info = document.querySelector(".infoDevice");
// let lists = document.querySelector("#services");
// info.style.display = "none"
// let options = {
//     acceptAllDevices: true
// }

// lists.addEventListener("change", (e) => {
//     console.log(e.target.value);
//     if (e.target.value !== "all") {


//         options = { filters: [{ services: [e.target.value] }] };
//     } else {
//         options = { acceptAllDevices: true }
//     }
// })

// btn.addEventListener("click", (e) => {
//     e.preventDefault();
//     info.style.display = ""
//     info.innerHTML = "<p>Recherche d'un appareil Bluetooth ...</p>"
//     navigator.bluetooth.requestDevice(options).then((device) => {
//         console.log("device ", device)
//         console.log("connect ", device.gatt.connect())
//         info.innerHTML = `
//             <p> > Nom de l'appareil : ${device.name} </p>
//             <p> > Id : ${device.id} </p> 
//             <p> > Connecté : ${device.gatt.connected} </p>
//         `
//         return device.gatt.connect();
//     }).then(server => {
//         console.log(server);
//         info.innerHTML = `
//             <p> > Nom de l'appareil : ${server.name} </p>
//             <p> > Id : ${server.id} </p> 
//             <p> > Connecté : ${server.gatt.connected} </p>
//         `
//         console.log("server ", server)
//     }).catch(err => {
//         console.log("err ", err);
//         info.innerHTML = "<p>Aucun appareil selectionné</p>"
//     })

//     console.log("click");
// })


try {

    chrome.bluetooth.getAdapterState(adp => {
        let p = document.createElement("p");

        console.log(adp.powered);
        p.innerHTML = "Etat bluetooth : " + (adp.powered ? "activé" : "desactivé");

        document.querySelector(".container").insertBefore(p, document.querySelector(".list"));
    })
    let ul = document.querySelector(".list");
    // chrome.bluetooth.getDevices(function (devices) {
    //     for (var i = 0; i < devices.length; i++) {
    //         let li = document.createElement("li");
    //         li.innerHTML = `name : ${devices[i].name} \n address_mac : ${devices[i].address}`;
    //         ul.appendChild(li);
    //     }
    // });

    var device_names = {};
    var updateDeviceName = function (device) {
        device_names[device.address] = device.name;
        console.log("new device ", document.querySelector("#" + "f" + device.address.replace(/:/g, "")));
        if (!document.querySelector("#" + "f" + device.address.replace(/:/g, ""))) {
            console.log("cree");
            let li = document.createElement("li");
            li.innerHTML = `${device.name}`;
            li.id = "f" + device.address.replace(/:/g, "");
            li.className = "list-group-item";
            ul.appendChild(li);
        }
    };
    var removeDeviceName = function (device) {
        delete device_names[device.address];
        console.log("remove -> name :  " + device.name + " address : " + device.address);
        console.log(document.querySelector("#" + "f" + device.address.replace(/:/g, "")));
        document.querySelector("#" + "f" + device.address.replace(/:/g, ""))?.remove();
    }

    // Add listeners to receive newly found devices and updates
    // to the previously known devices.
    chrome.bluetooth.onDeviceAdded.addListener(updateDeviceName);
    chrome.bluetooth.onDeviceChanged.addListener(updateDeviceName);
    chrome.bluetooth.onDeviceRemoved.addListener(removeDeviceName);

    // With the listeners in place, get the list of devices found in
    // previous discovery sessions, or any currently active ones,
    // along with paired devices.
    chrome.bluetooth.getDevices(function (devices) {
        for (var i = 0; i < devices.length; i++) {
            updateDeviceName(devices[i]);
        }
    });

    console.log("test search....")

    // Now begin the discovery process.
    chrome.bluetooth.startDiscovery(function () {
        console.log("start search....")
        // Stop discovery after 30 seconds.
        setTimeout(function () {
            chrome.bluetooth.stopDiscovery(function () {
                console.log("stop search....");
            });
        }, 600000);
    });
} catch (err) {
    console.log("erreur ", err)
}