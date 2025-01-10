document.addEventListener("DOMContentLoaded", function () {
    // Initialiser la carte
    const map = L.map('map').setView([23.5879, 72.3693], 14);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fonction pour afficher un message d'erreur dans la console et une alerte utilisateur
    const showError = (message) => {
        console.error(message);
        alert(message);
    };

    // Localiser l'utilisateur
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // Ajouter un marqueur pour la position de l'utilisateur
                const userMarker = L.marker([userLat, userLon]).addTo(map)
                    .bindPopup(`Your current position<br>Latitude: ${userLat}<br>Longitude: ${userLon}`)
                    .openPopup();

                // Centrer la carte sur la position de l'utilisateur
                map.setView([userLat, userLon], 14);

                // Récupérer le parking le plus proche avec des places disponibles
                fetch(`http://localhost:8080/api/parkings/nearest?lat=${userLat}&lon=${userLon}&limit=1`) // Limité à 1
                    .then(response => {
                        console.log("Fetch response status:", response.status); // Log du statut de la réponse
                        if (!response.ok) {
                            throw new Error("No available parkings found nearby.");
                        }
                        return response.json();
                    })
                    .then(parkings => {
                        console.log("Parkings fetched:", parkings); // Log des données récupérées
                        if (parkings.length > 0) {
                            const nearestParking = parkings[0];
                            console.log("Nearest parking:", nearestParking); // Log du parking le plus proche

                            // Ajouter un marqueur pour le parking le plus proche
                            L.marker([nearestParking.latitude, nearestParking.longitude]).addTo(map)
                                .bindPopup(
                                    `<b>${nearestParking.parkingName}</b><br>
                     <button id="reserveButton">Go to Reservation</button>`
                                )
                                .on('popupopen', function () {
                                    // Ajouter un gestionnaire d'événements au bouton
                                    document.getElementById('reserveButton').addEventListener('click', () => {
                                        // Redirection vers reservation.html avec des paramètres
                                        window.location.href = `reservation.html?parkingId=${nearestParking.parkingId}`;
                                    });
                                });

                            // Centrer la carte sur le parking le plus proche
                            map.setView([nearestParking.latitude, nearestParking.longitude], 14);
                        } else {
                            showError("No nearby parking with available spots found.");
                        }
                    })
                    .catch(error => {
                        showError("Error fetching nearest parking: " + error.message);
                    });
            },
            function () {
                showError("Failed to get your location. Please enable location services.");
            }
        );
    } else {
        showError("Your browser does not support geolocation.");
    }
});
