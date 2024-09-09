document.getElementById('openModalButton').addEventListener('click', function () {
    const modal = document.getElementById('modal');
    modal.showModal();
    document.body.classList.add('no-scroll');
});

document.getElementById('modalOverlay').addEventListener('click', function() {
    const modal = document.getElementById('modal');
    modal.close();
    document.body.classList.remove('no-scroll');
});

document.getElementById('closeModalButton').addEventListener('click', function () {
    const modal = document.getElementById('modal');
    modal.close();
    document.body.classList.remove('no-scroll');
});


document.getElementById('modal').addEventListener('submit', function(event) {
    event.preventDefault();

    let isValid = true;

    clearErrors();

    const nameInput = document.getElementById('name');
    if (nameInput.value.trim() === '') {
        showError('nameError', 'Name is required');
        nameInput.classList.add('modal__form-input--invalid');
        isValid = false;
    }

    const emailInput = document.getElementById('email');
    if (!validateEmail(emailInput.value)) {
        showError('emailError', 'Please enter a valid email');
        emailInput.classList.add('modal__form-input--invalid');
        isValid = false;
    }

    const messageInput = document.getElementById('message');
    if (messageInput.value.trim() === '') {
        showError('messageError', 'Message cannot be empty');
        messageInput.classList.add('modal__form-textarea--invalid');
        isValid = false;
    }

    if (isValid) {
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        };

        fetch('https://enqsonelogu3a.x.pipedream.net', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Form submitted successfully:', data);
                showSuccessPopup('Your message successfully sent');
            })
            .catch(error => {
                console.error('There was a problem with the submission:', error);
                alert('Error submitting form.');
            });
    }
});

function showError(elementId, message) {
    const errorElement = document.createElement('small');
    errorElement.className = 'modal__form-error';
    errorElement.textContent = message;
    document.getElementById(elementId).parentElement.appendChild(errorElement);
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.modal__form-error');
    errorElements.forEach(function(element) {
        element.remove();
    });

    const invalidInputs = document.querySelectorAll('.modal__form-input--invalid, .modal__form-textarea--invalid');
    invalidInputs.forEach(function(input) {
        input.classList.remove('modal__form-input--invalid', 'modal__form-textarea--invalid');
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showSuccessPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'modal__success-popup';
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3000);
}