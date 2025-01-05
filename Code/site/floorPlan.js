document.addEventListener('DOMContentLoaded', async function () {
    // Retrieve the event ID from localStorage
    const eventId = localStorage.getItem('selectedEventId'); // Get event ID from localStorage

    if (!eventId) {
        console.error('Event ID not found in localStorage.');
        return;
    }

    try {
        // Fetch the event data from the server
        const response = await fetch(`/events/${eventId}`);

        if (!response.ok) {
            throw new Error(`Error fetching event: ${response.statusText}`);
        }

        const eventData = await response.json();

        // Find the div where the event map should be displayed
        const svgContainer = document.querySelector('.map-container');
        if (!svgContainer) {
            console.error('SVG container not found in the DOM.');
            return;
        }

        // Set the event map in the container
        svgContainer.innerHTML = `<img src="${eventData.events_map}" alt="Event Map">`;

        // Fetch the number of qr codes on the event
        const numberOfQrCodes = eventData.events_num_qrcodes;


        // Find the div where the checkboxes should be dynamically added
        const qrCheckboxesContainer = document.getElementById('qr-checkboxes');
        if (!qrCheckboxesContainer) {
            console.error('QR checkboxes container not found in the DOM.');
            return;
        }

        // Create checkboxes for all the QR codes
        for (let i = 1; i <= numberOfQrCodes; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${i}`;
            checkbox.name = `QrCode ${i}`;
            checkbox.value = `qr-${i}`;
            checkbox.classList.add('qr-checkbox');

            const label = document.createElement('label');
            label.htmlFor = `QrCode ${i}`;
            label.textContent = `QR Code ${i}`;

            qrCheckboxesContainer.appendChild(checkbox);
            qrCheckboxesContainer.appendChild(label);
        }

    } catch (error) {
        console.error('Error fetching and displaying event map or QR codes:', error.message);
    }
});
