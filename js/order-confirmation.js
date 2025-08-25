// Order Confirmation Handler with Email Notification
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    const result = document.getElementById('result');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleOrderSubmission(e);
        });
    }

    // Initialize order summary
    loadOrderSummary();
    
    // Setup form validation
    setupFormValidation();
});

function handleOrderSubmission(e) {
    const form = e.target;
    const formData = new FormData(form);
    
    // Add cart data to form
    const cartItems = JSON.parse(localStorage.getItem('ceynatura-cart')) || [];
    const appliedCoupon = JSON.parse(localStorage.getItem('ceynatura-coupon')) || null;
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty. Please add items before confirming order.', 'error');
        return;
    }

    // Calculate order totals
    const subtotal = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.salePrice) * item.quantity);
    }, 0);
    
    const shipping = subtotal >= 2000 ? 0 : 200;
    let discount = 0;
    
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
    }
    
    const total = subtotal + shipping - discount;

    // Add order details to form data
    formData.append('orderType', 'new_order');
    formData.append('cartItems', JSON.stringify(cartItems));
    formData.append('subtotal', subtotal.toFixed(2));
    formData.append('shipping', shipping.toFixed(2));
    formData.append('discount', discount.toFixed(2));
    formData.append('total', total.toFixed(2));
    formData.append('couponCode', appliedCoupon ? appliedCoupon.code : '');
    formData.append('orderDate', new Date().toISOString());

    // Show loading state
    const confirmButton = document.getElementById('confirmButton');
    const originalText = confirmButton.innerHTML;
    confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    confirmButton.disabled = true;

    // Submit order via Web3Forms
    submitOrder(formData, confirmButton, originalText);
}

function submitOrder(formData, confirmButton, originalText) {
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

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
            // Order submitted successfully
            showOrderSuccess();
            
            // Clear cart after successful order
            localStorage.removeItem('ceynatura-cart');
            localStorage.removeItem('ceynatura-coupon');
            
            // Reset form
            document.getElementById('orderForm').reset();
            
        } else {
            console.log(response);
            showNotification('Failed to submit order. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.log(error);
        showNotification('Something went wrong! Please try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        confirmButton.innerHTML = originalText;
        confirmButton.disabled = false;
    });
}

function loadOrderSummary() {
    const cartItems = JSON.parse(localStorage.getItem('ceynatura-cart')) || [];
    const appliedCoupon = JSON.parse(localStorage.getItem('ceynatura-coupon')) || null;
    
    if (cartItems.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const orderItemsContainer = document.getElementById('orderItems');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderShipping = document.getElementById('orderShipping');
    const orderDiscount = document.getElementById('orderDiscount');
    const orderDiscountRow = document.getElementById('orderDiscountRow');
    const orderTotal = document.getElementById('orderTotal');

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.salePrice) * item.quantity);
    }, 0);

    const shipping = subtotal >= 2000 ? 0 : 200;
    let discount = 0;

    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
    }

    const total = subtotal + shipping - discount;

    // Populate order items
    orderItemsContainer.innerHTML = cartItems.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-meta">Qty: ${item.quantity} × ${item.weight}</div>
            </div>
            <div class="order-item-price">Rs. ${(parseFloat(item.salePrice) * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    // Update totals
    if (orderSubtotal) orderSubtotal.textContent = `Rs. ${subtotal.toFixed(2)}`;
    if (orderShipping) orderShipping.textContent = `Rs. ${shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `Rs. ${total.toFixed(2)}`;

    // Show/hide discount
    if (orderDiscountRow) {
        if (discount > 0) {
            orderDiscountRow.style.display = 'flex';
            if (orderDiscount) orderDiscount.textContent = `-Rs. ${discount.toFixed(2)}`;
        } else {
            orderDiscountRow.style.display = 'none';
        }
    }
}

function setupFormValidation() {
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });

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
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    clearFieldError(field);

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showOrderSuccess() {
    const orderForm = document.querySelector('.order-form-container');
    const orderSummary = document.querySelector('.order-summary-container');

    // Hide form and show success message
    orderForm.style.display = 'none';
    
    const successMessage = document.createElement('div');
    successMessage.className = 'order-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your order. We've received your shipping details and will contact you shortly to arrange payment and delivery.</p>
            <div class="success-actions">
                <a href="../index.html" class="btn btn-primary">Continue Shopping</a>
                <a href="products.html" class="btn btn-secondary">View Products</a>
            </div>
        </div>
    `;
    successMessage.style.cssText = `
        text-align: center;
        padding: 3rem 2rem;
        background: var(--white);
        border-radius: 20px;
        box-shadow: var(--shadow);
        border: 1px solid var(--light-beige);
        margin-bottom: 2rem;
    `;

    document.querySelector('.order-form-container').appendChild(successMessage);

    // Show notification
    showNotification('Order submitted successfully! Check your email for confirmation.', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#4a7c59',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
