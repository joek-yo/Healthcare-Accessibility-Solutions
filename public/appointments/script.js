document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const provider = document.getElementById('provider').value;
    const dateTime = document.getElementById('dateTime').value;

    try {
        const response = await fetch('/api/appointments/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ provider, dateTime })
        });

        if (response.ok) {
            alert('Appointment booked successfully');
        } else {
            alert('Failed to book appointment');
        }
    } catch (error) {
        alert('Error booking appointment');
    }
});
