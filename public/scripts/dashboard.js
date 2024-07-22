document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user profile information
        const profileResponse = await fetch('/api/profile');
        const profileData = await profileResponse.json();
        document.getElementById('profile-info').innerHTML = `
            <p>Name: ${profileData.name}</p>
            <p>Email: ${profileData.email}</p>
        `;

        // Fetch upcoming appointments
        const appointmentsResponse = await fetch('/api/appointments');
        const appointmentsData = await appointmentsResponse.json();
        document.getElementById('appointments').innerHTML = appointmentsData.map(app => `
            <div>
                <p>Appointment with Dr. ${app.doctorName}</p>
                <p>Date: ${new Date(app.date).toLocaleDateString()}</p>
                <p>Time: ${new Date(app.date).toLocaleTimeString()}</p>
            </div>
        `).join('');

        // Fetch notifications
        const notificationsResponse = await fetch('/api/notifications');
        const notificationsData = await notificationsResponse.json();
        document.getElementById('notifications').innerHTML = notificationsData.map(note => `
            <div>
                <p>${note.message}</p>
                <p>Date: ${new Date(note.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
});
