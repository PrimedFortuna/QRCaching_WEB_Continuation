document.addEventListener('DOMContentLoaded', function () {
    const eventId = localStorage.getItem('selectedEventId'); // Get event ID from localStorage

    if (!eventId) {
        // Handle case where no event ID is selected
        document.querySelector('.event-container').innerHTML = 'No event selected.';
        return;
    }

    // Fetch the event details by ID
    fetch(`https://maltinha.ddns.net/events/${eventId}`)
        .then(response => response.json())
        .then(event => {
            console.log('Event Data:', event); // Log the event data
            // Check if the event is found
            if (!event) {
                document.querySelector('.event-container').innerHTML = 'Event not found.';
                return;
            }

            // Set event details in the HTML
            document.getElementById('event_name').innerHTML = event.events_name;
            document.getElementById('event-image').setAttribute('src', event.events_photo);
            document.getElementById('event-latitude').innerHTML = event.events_latitude;
            document.getElementById('event-longitude').innerHTML = event.events_longitude;
            document.getElementById('event-start-date').innerHTML = new Date(event.events_idate).toLocaleDateString();
            document.getElementById('event-end-date').innerHTML = new Date(event.events_fdate).toLocaleDateString();

        })
        .catch(error => {
            console.error('Error fetching event data:', error);
            document.querySelector('.event-container').innerHTML = 'Error loading event details.';
        });
});
