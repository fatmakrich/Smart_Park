document.addEventListener("DOMContentLoaded", function () {
    // Initialiser la carte
    const map = L.map('map').setView([23.5879, 72.3693], 14);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Localiser l'utilisateur
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Ajouter un marqueur pour la position de l'utilisateur
            const userMarker = L.marker([userLat, userLon]).addTo(map)
                .bindPopup(`Your current position<br>Latitude: ${userLat}<br>Longitude: ${userLon}`)

                .openPopup();

            // Centrer la carte sur la position de l'utilisateur
            map.setView([userLat, userLon], 14);

            // Récupérer les parkings les plus proches avec places disponibles
            fetch(`http://localhost:8080/parkings/nearest?lat=${userLat}&lon=${userLon}&limit=5`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("No available parkings found nearby.");
                    }
                    return response.json();
                })
                .then(parkings => {
                    // Ajouter les parkings sur la carte
                    parkings.forEach(parking => {
                        L.marker([parking.latitude, parking.longitude]).addTo(map)
                            .bindPopup(`<b>${parking.parkingName}</b>`);
                    });
                })
                .catch(error => {
                    console.error("Error fetching parkings:", error);
                });
        }, function () {
            alert("Failed to get your location.");
        });
    } else {
        alert("Your browser does not support geolocation.");
    }
});
