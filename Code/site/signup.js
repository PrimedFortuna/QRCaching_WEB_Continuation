import CryptoJS from 'crypto-js';

document.addEventListener('DOMContentLoaded', () => {
    // Sign up function
    async function signUp() {
        // Get the input values
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate username

        if (username.length < 8) {
            alert("Username must be at least 8 characters long.");
            return;
        }

        // Validate email format using a simple regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Validate password
        const specialCharRegex = /[^a-zA-Z0-9.!]/;
        if (specialCharRegex.test(password)) {
            alert("Password can only contain letters, numbers, dots, and exclamation marks.");
            return;
        }

        // Hash the password before sending it
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Create user object
        const user = {
            user_name: username,
            user_email: email,
            user_password: hashedPassword,
        };

        try {
            // Send POST request to the server
            const response = await fetch('/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (data._id) {
                alert("User created successfully!");
                window.location.href = "/login.html";  // Redirect to login page
            } else {
                alert("Error: " + data.message);  // Handle errors from the server
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert("An error occurred during signup.");
        }
    }

    // Attach the signUp function to the button click event
    const signInButton = document.querySelector('.signup-btn');
    if (signInButton) {
        signInButton.addEventListener('click', (event) => {
            event.preventDefault();
            signUp();
        });
    } else {
        console.error("Sign-up button not found.");
    }
});
