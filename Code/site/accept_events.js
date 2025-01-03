document.addEventListener('DOMContentLoaded', function () {
    const eventList = document.getElementById('eventsToAccept_list');

    // Fetch confirmed events
    fetch('http://maltinha.ddns.net/events/confirmed')
        .then(response => response.json())
        .then(events => {
            if (events.length === 0) {
                eventList.innerHTML = 'No confirmed events available.';
            } else {
                eventList.innerHTML = '';
                events.forEach(event => {
                    const eventBox = document.createElement('div');
                    eventBox.className = 'eventsToAccept_box';

                    eventBox.innerHTML = `
                    <img src="${event.events_photo}" alt="Event Photo">
                    <h3>${event.events_name}</h3>
                    <p>Event Photo: <a href="${event.events_photo}" target="_blank">View Photo</a></p>
                    <p>Event Map: <a href="${event.events_map}" target="_blank">View Map</a></p>
                    <p>Event SVG: <img src="${event.events_svg}" alt="Event SVG"></p>
                    <p>Number of QR Codes: ${event.events_num_qrcodes}</p>                    
                    <p>Latitude: ${event.events_latitude}</p>
                    <p>Longitude: ${event.events_longitude}</p>
                    <p>Start Date: ${new Date(event.events_idate).toLocaleDateString()}</p>
                    <p>End Date: ${new Date(event.events_fdate).toLocaleDateString()}</p>
                    <div class="btn-group">
                        <button class="accept-btn" data-id="${event._id}">Accept</button>
                        <button class="decline-btn" data-id="${event._id}">Decline</button>
                    </div>
                    `;

                    eventList.appendChild(eventBox);
                });

                attachEventHandlers();
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            eventContainer.innerHTML = 'Error loading events.';
        });

    // Attach click event handlers
    function attachEventHandlers() {
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', () => handleAcceptEvent(button.dataset.id));
        });

        document.querySelectorAll('.decline-btn').forEach(button => {
            button.addEventListener('click', () => handleDeclineEvent(button.dataset.id));
        });
    }

    // Handle accept event
    async function handleAcceptEvent(eventId) {
        try {
            const response = await fetch('/events/accept_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventId)
            });

            await response.json();

        } catch (error) {
            console.error('Error accepting event:', error);
            alert('An error occurred during event accept.');
        }
    }

    // Handle decline event
    async function handleDeclineEvent(eventId) {
        try {
            const response = await fetch('/events/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventId)
            });

            await response.json();

        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred during deleting event.');
        }

    }
});