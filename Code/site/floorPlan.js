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
        const qrCodeData = await fetch(`/lqes/first_qrcode/${eventId}`);

        if (!qrCodeData.ok) {
            throw new Error(`Error fetching first QR code: ${qrCodeData.statusText}`);
        }
        
        const qrCodeResponse = await qrCodeData.json(); // Obter o JSON da resposta

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
            const label = document.createElement('label');
            label.htmlFor = `QrCode ${i}`;
            label.textContent = `QR Code ${i}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = qrCodeResponse + i;
            checkbox.name = `QrCode ${i}`;
            checkbox.value = `qr-${i}`;
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


    // Get the optimal path
    //function getPath() {
    //
    //    // Find the button that is clicked
    //    const findPathButton = document.getElementById('findPath');
    //    if (!findPathButton) {
    //        console.error('Find Path button not found in the DOM.');
    //        return;
    //    }
    //
    //    // Add an event listener to the button
    //    findPathButton.addEventListener('click', function () {
    //        const qrCheckboxes = document.querySelectorAll('.qr-checkbox');
    //        const checkedIds = [];
    //        qrCheckboxes.forEach(checkbox => {
    //            checkbox.addEventListener('change', function () {
    //                // Get the checked checkboxes
    //                const checkedCheckboxes = Array.from(qrCheckboxes).filter(checkbox => checkbox.checked);
    //
    //                // Get the ids of the checked checkboxes
    //                checkedIds = checkedCheckboxes.map(checkbox => checkbox.id);
    //            });
    //        });
    //
    //        //Compare the ids on the string and get the qrcodes that have those ids
    //        let qrCodeDataString = [];
    //        for (let i = 0; i < checkedIds.length; i++) {
    //            fetch(`/lqrcodes/find_by_id/${checkedIds[i]}`)
    //                .then(response => {
    //                    if (!response.ok) {
    //                        throw new Error(`Error fetching QR code: ${response.statusText}`);
    //                    }
    //                    return response.json();
    //                })
    //                .then(qrCodeData => {
    //                    // Get the qr code data
    //                    const qrCodeX = qrCodeData.lqrcode_longitude;
    //                    const qrCodeY = qrCodeData.lqrcode_latitude;
    //
    //                    // Put the qr code data in the query string
    //                    qrCodeDataString[i] = `${checkedIds[i]},${qrCodeX},${qrCodeY}`;
    //
    //                })
    //        }
    //
    //        //Fetch the svg map from the event
    //        const eventSVG = '';
    //        fetch(`/events/${eventId}`)
    //            .then(response => {
    //                if (!response.ok) {
    //                    throw new Error(`Error fetching event: ${response.statusText}`);
    //                }
    //                return response.json();
    //            })
    //            .then(eventData => {
    //                // Get the event map
    //                eventSVG = eventData.events_svg;
    //            })
    //
    //        // Get the qr code sequence
    //
    //        // Send the qrCodeDataString and eventSVG to the backend
    //        const pathData = {
    //            qrCodeDataString: qrCodeDataString,
    //            eventSVG: eventSVG
    //        };
    //
    //        fetch('/find-path', {
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/json',
    //            },
    //            body: JSON.stringify(pathData),
    //        })
    //            .then(response => response.json())
    //            .then(data => {
    //                console.log('Received QR sequence:', data.qr_sequence);
    //            })
    //            .catch(error => {
    //                console.error('Error:', error);
    //            });
    //
    //    });
    //}

    findPathButton.addEventListener('click', async function () {
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
                `${data.id},${data.lqrcode_longitude},${data.lqrcode_latitude}`
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
        } catch (error) {
            console.error('Error:', error);
        }

        // Display the result
        const pathOutput = document.getElementById('path-output');
        pathOutput.textContent = `Order of QR codes to collect: ${pathOrder.join(' -> ')}`;
    });

});
