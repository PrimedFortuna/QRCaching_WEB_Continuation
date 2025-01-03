document.addEventListener('DOMContentLoaded', function () {
    const navButtons1 = document.getElementById('nav_buttons1');
    const navButtons2 = document.getElementById('nav_buttons2');
    const adminButton = document.getElementById('admin_button');
    const event_buttons = document.getElementById('event_buttons');
    const acceptbtn = document.getElementById('acceptbtn');

    let isLoggedIn
    
    if (localStorage.getItem('userId')) {
        isLoggedIn = true;
    } else {
        isLoggedIn = false;
    }

    function isAdminUser() { // This function will be called after login
        const userId = localStorage.getItem('userId');
        if (userId === '67760b3001d708c46378eb2b') {
            return true;
        } else {
            adminButton.style.display = 'none';
            acceptbtn.style.display = 'none';
            return false;
        }
    }

    function updateButtons() {
        if (isLoggedIn) {
            navButtons1.style.display = 'none';
            navButtons2.style.display = 'flex';
            event_buttons.style.display = 'flex';
            isAdminUser();
        } else {
            navButtons1.style.display = 'flex';
            navButtons2.style.display = 'none';
            event_buttons.style.display = 'none';
        }
    }

    updateButtons();

    // Fetch the number of QR codes from the backend
    fetch('http://maltinha.ddns.net/lqrcodes/count')
        .then(response => response.json())
        .then(data => {
            const qrCodeCount = data.qrCodeCount;
            const qrCodeText = document.querySelector('.app_section_text h2');
            qrCodeText.textContent = `There are ${qrCodeCount} QR Codes in Lisbon`;
        })
        .catch(error => {
            console.error('Error fetching QR code count:', error);
        });


    // Function to fetch accepted events from the backend
    async function fetchAcceptedEvents() {
        try {
            const response = await fetch('/events/accepted'); // Adjust the endpoint if necessary
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const eventsAccepted = await response.json();
            return eventsAccepted;
        } catch (error) {
            console.error('Error fetching accepted events:', error);
            return [];
        }
    }

    // Function to render events in the DOM
    async function displayAcceptedEvents() {
        const eventContainer = document.querySelector('.event_container');
        eventContainer.innerHTML = ''; // Clear any existing events

        const events = await fetchAcceptedEvents();
        if (events.length === 0) {
            eventContainer.innerText = 'No accepted events to display.';
            return;
        }

        events.forEach((event, index) => {
            const div = document.createElement('div');
            div.classList.add('event_item');
            div.innerText = `Event ${index + 1}: ${event.events_name || 'Unnamed Event'}`;
            eventContainer.appendChild(div);
        });
    }

    // Call the function to display events when the page loads
    document.addEventListener('DOMContentLoaded', displayAcceptedEvents);


});
