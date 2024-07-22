document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/appointments');
        const appointments = await response.json();

        const appointmentsList = document.getElementById('appointmentsList');
        appointments.forEach(appointment => {
            const appointmentElement = document.createElement('div');
            appointmentElement.textContent = `Provider: ${appointment.provider.name}, Date and Time: ${new Date(appointment.dateTime).toLocaleString()}`;
            appointmentsList.appendChild(appointmentElement);
        });
    } catch (error) {
        console.error('Error fetching appointments', error);
    }
});
