// LinkNYC Database
var kiosk_data = "https://data.cityofnewyork.us/resource/n6c5-95xh.json"

// LinkNYC Icon
var wifi = L.icon({
    iconUrl: '../img/wifi-logo.png',
    shadowUrl: '../img/wifi-shadow.png',

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
    iconUrl: '../img/bike-full.png',
    iconSize: [bike_size_w, bike_size_h],
    popupAnchor: [0, -15]
  });
  

var bike_one = L.icon({
    iconUrl: '../img/bike-one.png',
    iconSize: [bike_size_w, bike_size_h],
    popupAnchor: [0, -15]
});
  
var bike_empty = L.icon({
    iconUrl: '../img/bike-empty.png',
    iconSize: [bike_size_w, bike_size_h],
    popupAnchor: [0, -15]
});

// Bathroom Database
var bathroom_data = "https://data.cityofnewyork.us/resource/hjae-yuav.json"
var bathroom_location_data = '../poi_data.json'

// Bathroom Icon
var toilet = L.icon({
    iconUrl: '../img/toilet.png',
    iconSize: [30, 40],
});

//ATM Data
var ATM_data = "https://data.ny.gov/resource/ndex-ad5r.json";

var atm = L.icon({
    iconUrl: '../img/atm.png',
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
                var x = kiosk.latitude;
                var y = kiosk.longitude;
                var id = kiosk.site_id;
                var status = kiosk.status;
                var network = kiosk.wifi_status;
                var phone = kiosk.phone_status;
                var tablet = kiosk.tablet_status;
                var address = kiosk.address;

                img_green = "../img/green-check.png"
                img_red = "../img/red-x.png"
                
                if (status == 'Live') {
                    status = img_green;
                } else {
                    status = img_red;
                }
                if (network == 'up') {
                    network = img_green;
                } else {
                    network = img_red;
                }
                if (phone == 'up') {
                    phone = img_green;
                } else {
                    phone = img_red;
                }
                if (tablet == 'up') {
                    tablet = img_green;
                } else {
                    tablet = img_red;
                }
                var address = `<strong>Address: </strong>` + address;
                var statusHTML = `<strong id="status-live">Status: <img src="` + status + `" width="10", height="10" alt="` + kiosk.status + `">`;
                var networkHTML = `<strong id="status-live">Wi-Fi: <img src="` + network + `" width="10", height="10" alt="` + kiosk.wifi_status + `">`;
                var phoneHTML = `<strong id="status-live">Phone: <img src="` + phone + `" width="10", height="10" alt="` + kiosk.phone_status + `">`;
                var tabletHTML = `<strong id="status-live">Table: <img src="` + tablet + `" width="10", height="10" alt="` + kiosk.tablet_status + `">`;
                
                L.marker([x, y], {icon: wifi})
                .addTo(map)
                .bindPopup(address + "<br><br>" + statusHTML + "<br><br>" + networkHTML + "<br><br>"  + phoneHTML + "<br><br>"  + tabletHTML);
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
            data = data.data.stations;
            data.forEach(station => {
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
                
                L.marker([x, y], {icon: icon})
                .addTo(map)
                .bindPopup(addressHTML + "<br>");
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

            fetch(bathroom_location_data)
            .then(response => response.json())
            .then(loc_data => {

                loc_data = loc_data.data
                icon = toilet;
                data.forEach(wc => {
                    
                    point = lookupLL(loc_data, wc.name.toUpperCase());
                    if (point != -1) {
                    
                        // Remove the "POINT" and parentheses from the string
                        point = point.toString().replace("POINT (", "").replace(")", "");

                        // Split the remaining string into an array of coordinates
                        point = point.split(" ");

                        // Extract the x and y values from the array
                        var x = parseFloat(point[0]);
                        var y = parseFloat(point[1]);

                        if (wc.handicap_accessible == "Yes") {
                            acc = "Yes";
                        } else{
                            acc = "No";
                        }

                        icon = toilet;
                        var nameHTML = `<strong>Name: </strong>` + wc.name + `<br>`;
                        var addressHTML = `<strong>Address: </strong>` + wc.location + `<br>`;
                        var openHTML = `<strong>Open Year-Round: </strong>` + wc.open_year_round + `<br>`;
                        var handicapHTML = `<strong>Handicap-Accessible: </strong>` + acc + `<br>`;
                        
                        L.marker([y,x], {icon: icon})
                        .addTo(map)
                        .bindPopup(nameHTML + "<br>" + addressHTML + "<br>" + openHTML + "<br>" + handicapHTML);
                    }
                });

            })

        })
        .catch(error => {
        console.error('Error:', error);
    });
}

function getATMs() {
    
}

// Function to look up an entry by location and return its index
function lookupLL(jsonArray, name) {
    for (let i = 0; i < jsonArray.length; i++) {
      if (jsonArray[i][23] == name) {
        return jsonArray[i][8]; // Return the index if location matches
      }
    }
    return -1; // Return -1 if no match is found
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