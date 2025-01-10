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

        // Fetch the first qr code id from the event
        const qrResponse = await fetch(`/lqes/first_qrcode/${eventId}`);

        if (!qrResponse.ok) {
            throw new Error(`Error fetching first QR code: ${qrResponse.statusText}`);
        }
        const { lowestQrCodeId } = await qrResponse.json();

        if (typeof lowestQrCodeId !== "number") {
            console.error('Invalid or missing lowest QR code ID.');
            return;
        }


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
        for (let i = 0; i < numberOfQrCodes; i++) {
            const numericId = lowestQrCodeId + i;

            const label = document.createElement('label');
            label.htmlFor = `QrCode ${i}`;
            label.textContent = `QR Code ${i}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = numericId;
            checkbox.name = `QrCode ${i}`;
            checkbox.value = numericId;
            checkbox.classList.add('qr-checkbox');

            qrCheckboxesContainer.appendChild(label);
            qrCheckboxesContainer.appendChild(checkbox);
        }

    } catch (error) {
        console.error('Error fetching and displaying event map or QR codes:', error.message);
    }

    const findPathButton = document.getElementById('findPath');
    if (!findPathButton) {
        console.error('Find Path button not found in the DOM.');
        return;
    }

    findPathButton.addEventListener('click', async function () {
        event.preventDefault(); // Prevent form from reloading the page
        try {
            // Collect checked QR codes
            const qrCheckboxes = document.querySelectorAll('.qr-checkbox');
            const checkedIds = Array.from(qrCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.id);

            if (checkedIds.length === 0) {
                console.error('No QR codes selected.');
                return;
            }

            // Fetch QR code data
            const qrCodeData = await Promise.all(
                checkedIds.map(id =>
                    fetch(`/lqrcodes/find_by_id/${id}`).then(response => {
                        if (!response.ok) {
                            throw new Error(`Error fetching QR code: ${response.statusText}`);
                        }
                        return response.json();
                    })
                )
            );

            const qrCodeDataString = qrCodeData.map(data =>
                `${data.lqrcode_id},${data.lqrcode_longitude},${data.lqrcode_latitude}`
            );

            // Fetch event data
            const eventData = await fetch(`/events/${eventId}`).then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching event: ${response.statusText}`);
                }
                return response.json();
            });

            const eventSVG = eventData.events_svg;

            // Send data to backend
            const pathData = { qrCodeDataString, eventSVG };

            const response = await fetch('/find-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pathData),
            });

            if (!response.ok) {
                throw new Error(`Error finding path: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Received QR sequence:', result.qr_sequence);

            // Display the received QR sequence in the path-output div
            const pathOutputDiv = document.getElementById('path-output');
            if (pathOutputDiv) {
                for (let i = 0; i < result.qr_sequence.length; i++) {
                    const qrCode = result.qr_sequence[i];
                    const qrCodeElement = document.createElement('p');
                    qrCodeElement.textContent = `QR Code ${qrCode.lqrcode_id} ->`;
                    pathOutputDiv.appendChild(qrCodeElement);

                }
            }

        } catch (error) {
            console.error('Error:', error);
        }


    });

});
