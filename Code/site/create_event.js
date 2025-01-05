document.addEventListener('DOMContentLoaded', () => {
    // Sign up function
    async function createEvent() {
        //Get the input values
        const eventName = document.getElementById('eventName').value.trim();
        const eventPhoto = document.getElementById('eventPhoto').value.trim();
        const eventMap = document.getElementById('eventMap').value.trim();
        const eventSvg = document.getElementById('eventSVG').value.trim();
        const eventQRCodes = document.getElementById('numQRCodes').value.trim();
        const eventIDate = document.getElementById('startDate').value.trim();
        const eventFDate = document.getElementById('endDate').value.trim();

        //Validate event name
        if (eventName.length < 8) {
            alert("Event name must be at least 8 characters long.");
            return;
        }

        //Create event object
        const event = {
            events_name: eventName,
            events_photo: eventPhoto,
            events_map: eventMap,
            events_svg: eventSvg,
            events_num_qrcodes: eventQRCodes,
            events_idate: eventIDate,
            events_fdate: eventFDate

        };

        fetch('/events/create_event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
            .then(response => response.json())
            .then(data => {
                if (data._id) {
                    alert("Event created successfully!");
                    window.location.href = "/index.html";
                    // Redirect or perform any other actions upon success
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred during event creation.");
            });
    }

    // Attach the Event creation function to the button click event
    const signInButton = document.querySelector('.createEvent');
    if (signInButton) {
        signInButton.addEventListener('click', (event) => {
            event.preventDefault();
            createEvent();
        });
    } else {
        console.error("createEvent button not found.");
    }
});


