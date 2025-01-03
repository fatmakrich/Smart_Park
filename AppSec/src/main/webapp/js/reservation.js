const hoursInput = document.getElementById('hours');
const priceDisplay = document.getElementById('price');
const increaseButton = document.getElementById('increase-hours');
const decreaseButton = document.getElementById('decrease-hours');
const form = document.getElementById('reservation-form');
const spotIdSelect = document.getElementById('spot-id');
const timeSelect = document.getElementById('select-time');
const parkingIdSelect = document.getElementById('parking-id');

// Constants
const pricePerHour = 5; // Price per hour

// Update price display
const updatePrice = () => {
    const hours = parseInt(hoursInput.value);
    const totalPrice = hours * pricePerHour;
    priceDisplay.textContent = `${totalPrice}`;
};

// Increase hours
increaseButton.addEventListener('click', () => {
    let hours = parseInt(hoursInput.value);
    if (hours < 24) { // Limit to 24 hours max
        hours++;
        hoursInput.value = hours;
        updatePrice();
    }
});

// Decrease hours
decreaseButton.addEventListener('click', () => {
    let hours = parseInt(hoursInput.value);
    if (hours > 1) { // Minimum of 1 hour
        hours--;
        hoursInput.value = hours;
        updatePrice();
    }
});

// Generate random 6-digit booking number
const generateBookingNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit random number
};

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Get selected values from the form
    const clientId = "123456"; // Example client ID, can be dynamic if needed
    const parkingId = parkingIdSelect.value;
    const spotId = spotIdSelect.value;
    const hours = parseInt(hoursInput.value); // Duration in hours
    const time = timeSelect.value;
    const carInfo = "Toyota Prius22, Blue, 2020"; // Example car info, modify as needed

    // Construct the startTime with the current date and the selected time
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(currentDate.getDate()).padStart(2, '0'); // Ensure two digits
    const startTime = `${year}-${month}-${day}T${time}:00`; // Format: "2025-01-03T08:00:00"

    // Log the data before sending it to the backend
    console.log('Données de réservation à envoyer:', {
        clientId: clientId,
        parkingId: parkingId,
        spotId: spotId,
        carInfo: carInfo,
        startTime: startTime, // Ensure the correct format "2025-01-03T08:00:00"
        duration: hours
    });

    // Construct the request body
    const reservationData = {
        clientId: clientId,
        parkingId: parkingId,
        spotId: spotId,
        carInfo: carInfo,
        startTime: startTime, // Format: "2025-01-03T08:00:00"
        duration: hours
    };

    // Send the data to the backend via a POST request
    fetch('http://localhost:8080/api/reservations/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(reservationData) // Convert the object to JSON string
    })
        .then(response => {
            // Log the response status and headers for debugging
            console.log('Réponse du backend (status):', response.status);
            return response.json(); // Ensure the response is in JSON format
        })
        .then(data => {
            // Log the response body (data) for debugging
            console.log('Réponse du backend (data):', data);

            // Handle success (e.g., show booking confirmation)
            const bookingInfo = document.getElementById('booking-info');
            const bookingSpotId = document.getElementById('booking-spot-id');
            const bookingParkingId = document.getElementById('booking-Parking-id');
            const bookingNumberDisplay = document.getElementById('booking-number');
            const bookingPrice = document.getElementById('booking-price');

            // Display booking info (optional, customize as needed)
            bookingParkingId.textContent = ` ${parkingId}`;
            bookingSpotId.textContent = ` ${spotId}`;
            bookingNumberDisplay.textContent = generateBookingNumber();
            bookingPrice.textContent = priceDisplay.textContent;

            // Show the booking info box
            bookingInfo.classList.remove('hidden');

            // Optionally, hide the form after submission
            form.style.display = 'none';
        })
        .catch(error => {
            // Handle errors (e.g., network or server errors)
            console.error('Erreur lors de la création de la réservation:', error);
        });
});
