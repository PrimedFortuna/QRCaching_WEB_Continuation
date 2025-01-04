document.addEventListener('DOMContentLoaded', function () {
    const eventId = localStorage.getItem('selectedEventId'); // Get event ID from localStorage

    if (!eventId) {
        // Handle case where no event ID is selected
        document.querySelector('.event-container').innerHTML = 'No event selected.';
        return;
    }

    // Fetch the event details by ID
    fetch(`http://maltinha.ddns.net/events/${eventId}`)
        .then(response => response.json())
        .then(event => {
            // Check if the event is found
            if (!event) {
                document.querySelector('.event-container').innerHTML = 'Event not found.';
                return;
            }

            // Set event details in the HTML
            document.getElementById('event-name').textContent = event.events_name;
            document.getElementById('event-image').src = event.events_photo;
            document.getElementById('event-latitude').textContent = event.events_latitude;
            document.getElementById('event-longitude').textContent = event.events_longitude;
            document.getElementById('event-start-date').textContent = new Date(event.events_idate).toLocaleDateString();
            document.getElementById('event-end-date').textContent = new Date(event.events_fdate).toLocaleDateString();

            // Additional: Handle floor plan and map
            const mapBackground = document.querySelector('.map-background-img');
            mapBackground.src = event.events_map;

        })
        .catch(error => {
            console.error('Error fetching event data:', error);
            document.querySelector('.event-container').innerHTML = 'Error loading event details.';
        });
});
