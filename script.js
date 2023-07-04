// LinkNYC Database
var kiosk_data = "https://data.cityofnewyork.us/resource/n6c5-95xh.json"

// LinkNYC Icon
var wifi = L.icon({
    iconUrl: 'img/wifi-logo.png',
    shadowUrl: 'img/wifi-shadow.png',

    iconSize: [30, 50],
    shadowSize: [30, 50],
    shadowAnchor: [5, -1]
    
})

// Citi Bike Database
var bike_data = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"

// Bike Icons
var bike_size_w = 100;
var bike_size_h = 50;

var bike_full = L.icon({
    iconUrl: 'img/bike-full.png',
    iconSize: [bike_size_w, bike_size_h],
    popupAnchor: [0, -15]
  });
  

var bike_one = L.icon({
    iconUrl: 'img/bike-one.png',
    iconSize: [bike_size_w, bike_size_h],
    popupAnchor: [0, -15]
});
  
var bike_empty = L.icon({
    iconUrl: 'img/bike-empty.png',
    iconSize: [bike_size_w, bike_size_h],
    popupAnchor: [0, -15]
});

// Bathroom Database
var bathroom_data = "./toilets_point.geojson"

// Bathroom Icon
var toilet = L.icon({
    iconUrl: 'img/toilet.png',
    iconSize: [30, 40],
});


  const map = L.map('map').setView([40.7128, -74.0060], 12); // Set the initial map view to NYC
getKiosks();


function getKiosks() {
    fetch(kiosk_data)
        .then(response => response.json())
        .then(data => {
            // Process JSON Data

            

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            data.forEach(kiosk => {
                console.log(kiosk);
                var x = kiosk.latitude;
                var y = kiosk.longitude;
                var id = kiosk.site_id;
                var status = kiosk.status;
                var network = kiosk.wifi_status;
                var phone = kiosk.phone_status;
                var tablet = kiosk.tablet_status;
                var address = kiosk.address;
                
                if (status == 'Live') {
                    status = "img/green-check.png";
                } else {
                    status = "img/red-x.png";
                }
                if (network == 'up') {
                    network = "img/green-check.png";
                } else {
                    network = "img/red-x.png";
                }
                if (phone == 'up') {
                    phone = "img/green-check.png";
                } else {
                    phone = "img/red-x.png";
                }
                if (tablet == 'up') {
                    tablet = "img/green-check.png";
                } else {
                    tablet = "img/red-x.png";
                }
                var address = `<strong>Address: </strong>` + address;
                var statusHTML = `<strong id="status-live">Status: <img src="` + status + `" width="10", height="10" alt="` + kiosk.status + `">`;
                var networkHTML = `<strong id="status-live">Wi-Fi: <img src="` + network + `" width="10", height="10" alt="` + kiosk.wifi_status + `">`;
                var phoneHTML = `<strong id="status-live">Phone: <img src="` + phone + `" width="10", height="10" alt="` + kiosk.phone_status + `">`;
                var tabletHTML = `<strong id="status-live">Table: <img src="` + tablet + `" width="10", height="10" alt="` + kiosk.tablet_status + `">`;
                
                L.marker([x, y], {icon: wifi})
                .addTo(map)
                .bindPopup(address + "<br>" + statusHTML + "<br>" + networkHTML + "<br>"  + phoneHTML + "<br>"  + tabletHTML);
            });

        })
        .catch(error => {
        console.error('Error:', error);
    });
}

function getBikes() {
    fetch(bike_data)
        .then(response => response.json())
        .then(data => {
            // Process JSON Data

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(map); 
            console.log(data.data.stations);
            data = data.data.stations;
            data.forEach(station => {
                console.log(station);
                var x = station.lat;
                var y = station.lon;
                var id = station.station_id;
                var capacity = station.capacity;
                var address = station.name;
                
                if (capacity == 0) {
                    icon=bike_empty;
                } else if (capacity < 4) {
                    icon = bike_one;
                } else {
                    icon = bike_full;
                }
                var addressHTML = `<strong>Address: </strong>` + address;
                var capacityHTML = `<strong id="capacity">Capacity:</strong> ` + capacity;
                
                L.marker([x, y], {icon: icon})
                .addTo(map)
                .bindPopup(addressHTML + "<br>" + capacityHTML);
            });

        })
        .catch(error => {
        console.error('Error:', error);
    });
}

function getBathrooms() {
    fetch(bathroom_data)
        .then(response => response.json())
        .then(data => {
            // Process JSON Data

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(map); 

            data = data.features;
            data.forEach(wc => {
                console.log(wc.geometry.coordinates);
                var x = wc.geometry.coordinates[1];
                var y = wc.geometry.coordinates[0];

                icon = toilet;
                var addressHTML = `<strong>Address: </strong>`;
                var capacityHTML = `<strong id="capacity">Capacity:</strong> `;
                
                L.marker([x, y], {icon: icon})
                .addTo(map)
                .bindPopup(addressHTML + "<br>" + capacityHTML);
            });

        })
        .catch(error => {
        console.error('Error:', error);
    });
}



function handleOptionChange(value) {

    // Clear the map of all markers on load
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

    // See what the user selected, and show the proper icon
    var selectedOption = value;
    console.log('Selected option: ' + selectedOption);
    if (selectedOption == "link") {
        getKiosks();
    } else if (selectedOption == "bike") {
        getBikes();
    } else if (selectedOption == "bathroom") {
        getBathrooms();
    }
}