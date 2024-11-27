import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Скрипт загружен');

    const form = document.getElementById('job-form');
    const saveButton = document.getElementById('save-info'); 

    if (!form) {
        console.error('Форма с ID "job-form" не найдена');
        return;
    }
    console.log('Форма найдена:', form);

    const modal = createModal(); 

    
    const savedData = localStorage.getItem('jobData');
    if (savedData) {
        const jobData = JSON.parse(savedData);
        console.log('Загруженные данные из LocalStorage:', jobData);
        populateForm(jobData);
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Обработчик формы вызван');

        
        const isValid = validateForm();
        if (!isValid) {
            alert('Исправьте ошибки перед отправкой формы.');
            return;
        }

        
        const jobData = getFormData();

        console.log('Job Data:', jobData);

        try {
            const dealId = await sendToPipedrive(jobData);
            showModal(dealId); 
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    });

    
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const jobData = getFormData();
            localStorage.setItem('jobData', JSON.stringify(jobData));
            alert('Информация сохранена в LocalStorage.');
            console.log('Сохраненные данные:', jobData);
        });
    }

    
    function getFormData() {
        return {
            firstName: document.getElementById('first-name')?.value,
            lastName: document.getElementById('last-name')?.value,
            phone: document.getElementById('phone')?.value,
            email: document.getElementById('email')?.value,
            jobType: document.getElementById('job-type')?.value,
            jobSource: document.getElementById('job-source')?.value,
            description: document.getElementById('description')?.value,
            address: document.getElementById('address')?.value,
            city: document.getElementById('city')?.value,
            state: document.getElementById('state')?.value,
            zipCode: document.getElementById('zip-code')?.value,
            startDate: document.getElementById('start-date')?.value,
            startTime: document.getElementById('start-time')?.value,
            endTime: document.getElementById('end-time')?.value,
        };
    }

    
    function populateForm(data) {
        for (const key in data) {
            const input = document.getElementById(key);
            if (input) input.value = data[key];
        }
    }

    
    function validateForm() {
        let isValid = true;
        let firstInvalidField = null;

        const fields = [
            { id: 'first-name', name: 'First Name' },
            { id: 'phone', name: 'Phone', pattern: /^[0-9+\-()\s]+$/ },
            { id: 'email', name: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            { id: 'job-source', name: 'Job Source' },
            { id: 'address', name: 'Address' },
            { id: 'city', name: 'City' },
            { id: 'state', name: 'State' },
            { id: 'zip-code', name: 'Zip Code' },
            { id: 'start-date', name: 'Start Date' },
            { id: 'start-time', name: 'Start Time' },
            { id: 'end-time', name: 'End Time' },
        ];

        fields.forEach((field) => {
            const input = document.getElementById(field.id);

            if (!input.value.trim()) {
                isValid = false;
                showError(input, `${field.name} is required.`);
                if (!firstInvalidField) firstInvalidField = input;
            } else if (field.pattern && !field.pattern.test(input.value)) {
                isValid = false;
                showError(input, `${field.name} is invalid.`);
                if (!firstInvalidField) firstInvalidField = input;
            } else {
                removeError(input);
            }
        });

        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }

        return isValid;
    }

    
    function showError(input, message) {
        input.classList.add('error');
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains('error-message')) {
            error = document.createElement('div');
            error.className = 'error-message';
            input.parentNode.appendChild(error);
        }
        error.textContent = message;
    }


    function removeError(input) {
        input.classList.remove('error');
        const error = input.nextElementSibling;
        if (error && error.classList.contains('error-message')) {
            error.remove();
        }
    }

    const API_KEY = '385fe99f824b314d9fc8bf06e776bcf1bead6aa0';
    const API_URL = `https://api.pipedrive.com/v1/deals?api_token=${API_KEY}`;

    async function sendToPipedrive(data) {
        console.log('Отправка данных в Pipedrive:', data);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: `${data.firstName} ${data.lastName} - ${data.jobType}`,
                    value: 0,
                    currency: 'USD',
                }),
            });

            console.log('Ответ от Pipedrive:', response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка API: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Результат:', result);
            form.reset(); 
            return result.data.id; 
        } catch (error) {
            console.error('Ошибка API:', error);
            alert('Ошибка при создании Job. Попробуйте снова.');
        }
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p id="modal-message"></p>
                <button id="view-deal" class="button">View Deal</button>
                <button id="close-modal" class="button">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModalButton = modal.querySelector('#close-modal');
        closeModalButton.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        return modal;
    }

    function showModal(dealId) {
        const modalMessage = modal.querySelector('#modal-message');
        modalMessage.textContent = 'Job успешно создан!';
        const viewDealButton = modal.querySelector('#view-deal');
        viewDealButton.onclick = () => {
            window.open(`https://app.pipedrive.com/deal/${dealId}`, '_blank');
        };

        modal.classList.add('show');
    }
});
