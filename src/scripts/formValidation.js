class ModalForm {
    constructor(modalId, openButtonId, closeButtonId) {
        this.modal = document.getElementById(modalId);
        this.openButton = document.getElementById(openButtonId);
        this.closeButton = document.getElementById(closeButtonId);
        this.nameInput = this.modal.querySelector('#name');
        this.emailInput = this.modal.querySelector('#email');
        this.messageInput = this.modal.querySelector('#message');

        this.bindEvents();
    }

    bindEvents() {
        this.openButton.addEventListener('click', () => this.openModal());
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (event) => this.handleOutsideClick(event));
        this.modal.addEventListener('submit', (event) => this.handleFormSubmit(event));
    }

    openModal() {
        this.modal.showModal();
        document.body.classList.add('no-scroll');
    }

    closeModal() {
        this.modal.close();
        document.body.classList.remove('no-scroll');
    }

    handleOutsideClick(event) {
        if (event.target === this.modal) {
            this.closeModal();
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        this.clearErrors();

        const isValid = this.validateForm();

        if (isValid) {
            const formData = {
                name: this.nameInput.value,
                email: this.emailInput.value,
                message: this.messageInput.value,
            };

            this.submitForm(formData);
        }
    }

    validateForm() {
        let isValid = true;

        if (this.nameInput.value.trim() === '') {
            this.showError('nameError', 'Name is required');
            this.nameInput.classList.add('modal__form-input--invalid');
            isValid = false;
        }

        if (!this.isValidEmail(this.emailInput.value)) {
            this.showError('emailError', 'Please enter a valid email');
            this.emailInput.classList.add('modal__form-input--invalid');
            isValid = false;
        }

        if (this.messageInput.value.trim() === '') {
            this.showError('messageError', 'Message cannot be empty');
            this.messageInput.classList.add('modal__form-textarea--invalid');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    showError(elementId, message) {
        const errorElement = document.createElement('small');
        errorElement.className = 'modal__form-error';
        errorElement.textContent = message;

        const parentElement = this.modal.querySelector(`#${elementId}`).parentElement;
        parentElement.appendChild(errorElement);
    }

    clearErrors() {
        const errorElements = this.modal.querySelectorAll('.modal__form-error');
        errorElements.forEach((element) => element.remove());

        const invalidInputs = this.modal.querySelectorAll(
            '.modal__form-input--invalid, .modal__form-textarea--invalid'
        );
        invalidInputs.forEach((input) =>
            input.classList.remove('modal__form-input--invalid', 'modal__form-textarea--invalid')
        );
    }

    submitForm(formData) {
        fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Form submission failed');
                }
                return response.json();
            })
            .then(() => {
                this.showSuccessMessage('Your message was successfully sent');
                this.closeModal();
                this.resetForm();
            })
            .catch(() => {
                this.showErrorMessage('Error submitting form.');
            });
    }

    resetForm() {
        this.nameInput.value = '';
        this.emailInput.value = '';
        this.messageInput.value = '';
    }

    showSuccessMessage(message) {
        const popup = document.createElement('div');
        popup.className = 'modal__success-popup';
        popup.textContent = message;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 3000);
    }

    showErrorMessage(message) {
        const errorPopup = document.createElement('div');
        errorPopup.className = 'modal__error-popup';
        errorPopup.textContent = message;

        document.body.appendChild(errorPopup);

        setTimeout(() => {
            errorPopup.remove();
        }, 3000);
    }
}

new ModalForm('modal', 'openModalButton', 'closeModalButton');