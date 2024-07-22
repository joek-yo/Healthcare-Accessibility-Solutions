document.addEventListener('DOMContentLoaded', () => {
    const ehrForm = document.getElementById('ehr-form');
    const medicalHistoryContainer = document.getElementById('medical-history');
    const medicationsContainer = document.getElementById('medications');
    const appointmentsContainer = document.getElementById('appointments');
    const addMedicalHistoryButton = document.getElementById('add-medical-history');
    const addMedicationButton = document.getElementById('add-medication');
    const addAppointmentButton = document.getElementById('add-appointment');
    const ehrDataDiv = document.getElementById('ehr-data');
    
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    function createInput(name, placeholder) {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.placeholder = placeholder;
        return input;
    }

    function createDateInput(name) {
        const input = document.createElement('input');
        input.type = 'date';
        input.name = name;
        return input;
    }

    function createMedicalHistory() {
        const container = document.createElement('div');
        container.appendChild(createInput('condition', 'Condition'));
        container.appendChild(createInput('treatment', 'Treatment'));
        container.appendChild(createDateInput('date'));
        return container;
    }

    function createMedication() {
        const container = document.createElement('div');
        container.appendChild(createInput('name', 'Medication Name'));
        container.appendChild(createInput('dosage', 'Dosage'));
        container.appendChild(createInput('frequency', 'Frequency'));
        return container;
    }

    function createAppointment() {
        const container = document.createElement('div');
        container.appendChild(createDateInput('date'));
        container.appendChild(createInput('doctor', 'Doctor'));
        container.appendChild(createInput('notes', 'Notes'));
        return container;
    }

    addMedicalHistoryButton.addEventListener('click', () => {
        medicalHistoryContainer.appendChild(createMedicalHistory());
    });

    addMedicationButton.addEventListener('click', () => {
        medicationsContainer.appendChild(createMedication());
    });

    addAppointmentButton.addEventListener('click', () => {
        appointmentsContainer.appendChild(createAppointment());
    });

    ehrForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(ehrForm);
        const ehrData = {
            personalInfo: {
                name: formData.get('name'),
                age: formData.get('age'),
                gender: formData.get('gender'),
                contact: {
                    email: formData.get('email'),
                    phone: formData.get('phone')
                }
            },
            medicalHistory: [],
            medications: [],
            appointments: []
        };

        medicalHistoryContainer.childNodes.forEach(node => {
            ehrData.medicalHistory.push({
                condition: node.querySelector('[name="condition"]').value,
                treatment: node.querySelector('[name="treatment"]').value,
                date: node.querySelector('[name="date"]').value
            });
        });

        medicationsContainer.childNodes.forEach(node => {
            ehrData.medications.push({
                name: node.querySelector('[name="name"]').value,
                dosage: node.querySelector('[name="dosage"]').value,
                frequency: node.querySelector('[name="frequency"]').value
            });
        });

        appointmentsContainer.childNodes.forEach(node => {
            ehrData.appointments.push({
                date: node.querySelector('[name="date"]').value,
                doctor: node.querySelector('[name="doctor"]').value,
                notes: node.querySelector('[name="notes"]').value
            });
        });

        try {
            const response = await fetch('/ehr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(ehrData)
            });

            if (response.ok) {
                const data = await response.json();
                displayEHRData(data);
            } else {
                console.error('Failed to save EHR');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function fetchEHRData() {
        try {
            const response = await fetch('/ehr', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                displayEHRData(data);
            } else {
                console.error('Failed to fetch EHR data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayEHRData(data) {
        ehrDataDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    // Fetch EHR data on page load
    fetchEHRData();
});
