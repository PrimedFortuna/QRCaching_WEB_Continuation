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

        // Set the event map (SVG or image) in the container
        svgContainer.innerHTML = `<img src="${eventData.events_map}" alt="Event Map">`;

        // Fetch the QR codes associated with this event
        const qrResponse = await fetch(`/qrcodes_associated/${eventId}`);
        if (!qrResponse.ok) {
            throw new Error(`Error fetching QR codes: ${qrResponse.statusText}`);
        }

        const qrCodes = await qrResponse.json();

        // Find the div where the checkboxes should be dynamically added
        const qrCheckboxesContainer = document.getElementById('qr-checkboxes');
        if (!qrCheckboxesContainer) {
            console.error('QR checkboxes container not found in the DOM.');
            return;
        }

        // Create checkboxes for each QR code
        qrCodes.forEach(qrCode => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.classList.add('qr-checkbox-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `qr-checkbox-${qrCode.lqrcode_id}`;
            checkbox.value = qrCode.lqrcode_id;

            const label = document.createElement('label');
            label.setAttribute('for', `qr-checkbox-${qrCode.lqrcode_id}`);
            label.textContent = `QR Code ${qrCode.lqrcode_id}`;

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);

            qrCheckboxesContainer.appendChild(checkboxDiv);
        });

    } catch (error) {
        console.error('Error fetching and displaying event map or QR codes:', error.message);
    }
});
