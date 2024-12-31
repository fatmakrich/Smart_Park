// Define the base URL dynamically
const baseURL = window.location.protocol + "//" + window.location.hostname + ":8080/";

// Attach the click event handler to the signup button
document.getElementById("signup").onclick = function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the input fields
    const userName = $('#username').val(); // Ensure IDs match your HTML
    const mail = $('#email').val();
    const password = $('#password').val();

    // Validate the inputs
    if (!userName || !mail || !password) {
        console.error('All fields are required.');
        alert('Please fill in all the fields.');
        return;
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
        console.error('Invalid email format.');
        alert('Please enter a valid email address.');
        return;
    }

    // Create the request object
    const reqObj = {
        mail: mail,
        userName: userName,
        password: password,
        permissionLevel: 1
    };

    // Perform the AJAX request
    $.ajax({
        url: baseURL + 'api/user',
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(reqObj),
        success: function (data) {
            // Handle success response
            console.log('User created successfully:', data);
            alert('Account created successfully. Please log in.');
            window.location.href = '/pages/signin.html'; // Redirect to sign-in page
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('Error creating user:', error);
            const errorMessage = xhr.responseJSON?.message || 'An unexpected error occurred.';
            alert(`Error: ${errorMessage}`);
        },
        complete: function () {
            // This block will execute regardless of success or failure
            console.log('Request completed.');
        }
    });
};
