// Contact Form Handler for contact.html page with Web3Forms integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const result = document.getElementById('result');
    
    if (form && result) {
        form.addEventListener('submit', function(e) {
            const formData = new FormData(form);
            e.preventDefault();

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Show loading state
            setResultState(result, 'loading', 'Sending your message...');

            fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        setResultState(result, 'success', json.message || 'Thanks! Your message has been sent.');
                    } else {
                        console.log(response);
                        setResultState(result, 'error', json.message || 'Sorry, something went wrong.');
                    }
                })
                .catch(error => {
                    console.log(error);
                    setResultState(result, 'error', 'Network error. Please try again.');
                })
                .then(function() {
                    form.reset();
                    setTimeout(() => {
                        result.classList.remove('show', 'fade-in', 'is-loading', 'is-success', 'is-error');
                    }, 3500);
                });
        });
    }
});

function setResultState(resultEl, state, message) {
    resultEl.classList.remove('is-loading', 'is-success', 'is-error');
    const content = resultEl.querySelector('.result-content');
    let icon = '';
    if (state === 'loading') {
        resultEl.classList.add('is-loading');
        icon = '<span class="result-icon"><i class="fas fa-spinner fa-spin"></i></span>';
    } else if (state === 'success') {
        resultEl.classList.add('is-success');
        icon = '<span class="result-icon"><i class="fas fa-check-circle"></i></span>';
    } else if (state === 'error') {
        resultEl.classList.add('is-error');
        icon = '<span class="result-icon"><i class="fas fa-exclamation-circle"></i></span>';
    }
    if (content) {
        content.innerHTML = icon + '<span>' + message + '</span>';
    } else {
        resultEl.innerHTML = icon + '<span>' + message + '</span>';
    }
    resultEl.classList.add('show', 'fade-in');
}

// Add some interactive features for the contact form
document.addEventListener('DOMContentLoaded', function() {
    // Phone number formatting
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    }
    
    // Subject dropdown enhancement
    const subjectSelect = document.querySelector('#subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            if (this.value) {
                this.style.borderColor = '#4a7c59';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }
    
    // Form field focus effects
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});
