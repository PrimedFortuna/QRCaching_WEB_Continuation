// Import CryptoJS
import CryptoJS from 'crypto-js';

document.addEventListener('DOMContentLoaded', () => {
    async function login() {
        // Get the input values
        const email = document.getElementById('email1').value.trim();
        const password = CryptoJS.SHA256(document.getElementById('password1').value.trim()).toString(); // Hash the password
        
        // Create login object
        const loginData = {
            user_email: email,
            user_password: password
        };

        // Send POST request to the server
        try {
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('authToken', data.token); // Store token securely
                sessionStorage.setItem('userName', data.userName); // Optionally store user info
                alert('Login successful!');
                window.location.href = "/index.html";
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login.');
        }
    }

    // Attach the login function to the button click event
    const loginButton = document.querySelector('.login-btn');
    if (loginButton) {
        loginButton.addEventListener('click', (event) => {
            event.preventDefault();
            login();
        });
    } else {
        console.error('Login button not found.');
    }
});
