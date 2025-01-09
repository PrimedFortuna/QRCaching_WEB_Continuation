document.addEventListener('DOMContentLoaded', function () {
    const eventList = document.getElementById('eventsToAccept_list');

    // Fetch confirmed events
    fetch('https://maltinha.ddns.net/events/unconfirmed')
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
                    <h3>${event.events_name}</h3>
                    <p>Event Photo: <a href="${event.events_photo}" target="_blank">View Photo</a></p>
                    <p>Event Map: <a href="${event.events_map}" target="_blank">View Map</a></p>
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
                body: JSON.stringify({ id: eventId }) 
            });

            if (!response.ok) {
                throw new Error(`Failed to accept event, status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); 

            // Reload the page after event is declined
            location.reload();
        } catch (error) {
            console.error('Error accepting event:', error);
            alert('An error occurred during event acceptance.');
        }
    }

    // Handle decline event
    async function handleDeclineEvent(eventId) {
        try {
            const response = await fetch(`/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to decline event, status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            // Reload the page after event is declined
            location.reload();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred during deleting event.');
        }

    }
});