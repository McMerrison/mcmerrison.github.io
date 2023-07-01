var data_url = "https://data.cityofnewyork.us/resource/n6c5-95xh.json"

fetch(data_url)
    .then(response => response.json())
    .then(data => {
        // Process JSON Data
        const map = L.map('map').setView([40.7128, -74.0060], 12); // Set the initial map view to NYC

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);
    })
    .catch(error => {
    console.error('Error:', error);
    });