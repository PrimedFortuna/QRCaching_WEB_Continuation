document.addEventListener('DOMContentLoaded', function () {
    const navButtons1 = document.getElementById('nav_buttons1');
    const navButtons2 = document.getElementById('nav_buttons2');
    const adminButton = document.getElementById('admin_button');
    const event_buttons = document.getElementById('event_buttons');
    const acceptbtn = document.getElementById('acceptbtn');

    // Clear the event ID from localStorage
    localStorage.removeItem('selectedEventId');

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

    const eventContainer = document.querySelector('.event_container'); // Get the container where the events will be displayed

    fetch('http://maltinha.ddns.net/events/confirmed')
        .then(response => response.json())
        .then(events => {
            if (events.length === 0) {
                eventContainer.innerHTML = 'No confirmed events available.';
            } else {
                events.forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event_item');
                    eventDiv.textContent = event.events_name; 

                    // Add a custom attribute to store the event ID
                    eventDiv.setAttribute('data-event-id', event.events_id);

                    // Add a click event listener to store the ID in localStorage and navigate
                    eventDiv.addEventListener('click', function () {
                        const eventId = this.getAttribute('data-event-id');
                        localStorage.setItem('selectedEventId', eventId); 
                        window.location.href = 'event.html'; 
                    });

                    eventContainer.appendChild(eventDiv); r
                });
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            eventContainer.innerHTML = 'Error loading events.';
        });


});

