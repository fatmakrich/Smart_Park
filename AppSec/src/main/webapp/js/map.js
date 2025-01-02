document.addEventListener("DOMContentLoaded", function () {
    // Initialiser la carte
    const map = L.map('map').setView([23.5879, 72.3693], 14); // Coordonnées pour Mehsana, Inde

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
                .bindPopup("Your current position")
                .openPopup();

            // Centrer la carte sur la position de l'utilisateur
            map.setView([userLat, userLon], 14);
        }, function () {
            alert("La géolocalisation a échoué.");
        });
    } else {
        alert("Votre navigateur ne supporte pas la géolocalisation.");
    }

    // Exemple de parkings
    const parkings = [
        { name: "Parking 1", lat: 23.589, lon: 72.368 },
        { name: "Parking 2", lat: 23.590, lon: 72.370 },
        { name: "Parking 3", lat: 23.586, lon: 72.367 },
    ];

    // Ajouter des marqueurs pour les parkings
    parkings.forEach(parking => {
        L.marker([parking.lat, parking.lon]).addTo(map)
            .bindPopup(`<b>${parking.name}</b><br>Disponible`);
    });
});
