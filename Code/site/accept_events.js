document.addEventListener('DOMContentLoaded', function () {
    const eventList = document.getElementById('eventsToAccept_list');

    // Fetch confirmed events
    fetch('http://maltinha.ddns.net/events/unconfirmed')
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
     async function handleAcceptEvent(eventId, svgPath) {
        try {
            const response = await fetch(svgPath);
            const svgText = await response.text();

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const blackDots = svgDoc.querySelectorAll('rect[style*="fill:#000000"]');

            const qrcodes = Array.from(blackDots).map(dot => ({
                lqrcode_longitude: parseFloat(dot.getAttribute('x')),
                lqrcode_latitude: parseFloat(dot.getAttribute('y')),
                lqrcode_altitude: null,
                lqrcode_is_event: true,
                lqrcode_is_quest: null,
            }));

            for (const qrcode of qrcodes) {
                const qrResponse = await fetch('/qrcodes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(qrcode)
                });

                if (!qrResponse.ok) {
                    throw new Error(`Failed to create QR code, status: ${qrResponse.status}`);
                }

                const createdQrcode = await qrResponse.json();
                const lqeResponse = await fetch('/lqes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        lqe_lqrcode_id: createdQrcode._id,
                        lqe_events_id: eventId,
                    })
                });

                if (!lqeResponse.ok) {
                    throw new Error(`Failed to create LQE, status: ${lqeResponse.status}`);
                }
            }

            const acceptResponse = await fetch('/events/accept_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: eventId })
            });

            if (!acceptResponse.ok) {
                throw new Error(`Failed to accept event, status: ${acceptResponse.status}`);
            }

            console.log('Event accepted and QR codes created successfully');
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