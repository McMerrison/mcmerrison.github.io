// LinkNYC Database
var data_url = "https://data.cityofnewyork.us/resource/n6c5-95xh.json"

// Icon on Map
var wifi = L.icon({
    iconUrl: 'wifi-logo.png',
    shadowUrl: 'wifi-shadow.png',

    iconSize: [30, 50],
    shadowSize: [30, 50],
    shadowAnchor: [5, -1]
    
})

fetch(data_url)
    .then(response => response.json())
    .then(data => {
        // Process JSON Data
        const map = L.map('map').setView([40.7128, -74.0060], 12); // Set the initial map view to NYC

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
                status = "green-check.png";
            } else {
                status = "red-x.png";
            }
            if (network == 'up') {
                network = "green-check.png";
            } else {
                network = "red-x.png";
            }
            if (phone == 'up') {
                phone = "green-check.png";
            } else {
                phone = "red-x.png";
            }
            if (tablet == 'up') {
                tablet = "green-check.png";
            } else {
                tablet = "red-x.png";
            }
            var address = `<strong>Address: </strong>` + address;
            var statusHTML = `<strong id="status-live">Status: <img src="` + status + `" width="10", height="10" alt="` + kiosk.phone_status + `">`;
            var networkHTML = `<strong id="status-live">Wi-Fi: <img src="` + network + `" width="10", height="10" alt="` + kiosk.phone_status + `">`;
            var phoneHTML = `<strong id="status-live">Phone: <img src="` + phone + `" width="10", height="10" alt="` + kiosk.phone_status + `">`;
            var tabletHTML = `<strong id="status-live">Table: <img src="` + tablet + `" width="10", height="10" alt="` + kiosk.phone_status + `">`;
            
            L.marker([x, y], {icon: wifi})
            .addTo(map)
            .bindPopup(address + "<br>" + statusHTML + "<br>" + networkHTML + "<br>"  + phoneHTML + "<br>"  + tabletHTML);
          });

    })
    .catch(error => {
    console.error('Error:', error);
    });

