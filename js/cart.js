// Cart Management System
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('ceynatura-cart')) || [];
        this.coupons = {
            'WELCOME10': 10,
            'SPICE20': 20,
            'CEYLON15': 15
        };
        this.appliedCoupon = null;
        this.shippingCost = 0;
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartCount();
        this.bindEvents();
        this.calculateTotals();
    }

    bindEvents() {
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Apply coupon button
        const applyCouponBtn = document.getElementById('applyCoupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => this.applyCoupon());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Coupon input enter key
        const couponInput = document.getElementById('couponCode');
        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyCoupon();
                }
            });
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        this.calculateTotals();
        
        // Show success notification
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        this.calculateTotals();
        
        this.showNotification('Item removed from cart', 'info');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
            this.calculateTotals();
        }
    }

    clearCart() {
        if (this.items.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.items = [];
            this.appliedCoupon = null;
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
            this.calculateTotals();
            
            this.showNotification('Cart cleared successfully', 'info');
        }
    }

    applyCoupon() {
        const couponInput = document.getElementById('couponCode');
        const couponCode = couponInput.value.trim().toUpperCase();
        
        if (!couponCode) {
            this.showNotification('Please enter a coupon code', 'error');
            return;
        }

        if (this.coupons[couponCode]) {
            this.appliedCoupon = {
                code: couponCode,
                discount: this.coupons[couponCode]
            };
            this.calculateTotals();
            this.showNotification(`Coupon ${couponCode} applied! ${this.appliedCoupon.discount}% off`, 'success');
            couponInput.value = '';
        } else {
            this.showNotification('Invalid coupon code', 'error');
        }
    }

    removeCoupon() {
        this.appliedCoupon = null;
        this.calculateTotals();
        this.showNotification('Coupon removed', 'info');
    }

    calculateTotals() {
        const subtotal = this.items.reduce((total, item) => {
            return total + (parseFloat(item.salePrice) * item.quantity);
        }, 0);

        // Calculate shipping (free over Rs. 2000, otherwise Rs. 200)
        this.shippingCost = subtotal >= 2000 ? 0 : 200;

        // Calculate discount
        let discount = 0;
        if (this.appliedCoupon) {
            discount = (subtotal * this.appliedCoupon.discount) / 100;
        }

        const total = subtotal + this.shippingCost - discount;

        // Update display
        this.updateSummaryDisplay(subtotal, this.shippingCost, discount, total);
    }

    updateSummaryDisplay(subtotal, shipping, discount, total) {
        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping');
        const discountEl = document.getElementById('discount');
        const totalEl = document.getElementById('total');
        const discountRow = document.getElementById('discountRow');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = `Rs. ${shipping.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `Rs. ${total.toFixed(2)}`;

        // Show/hide discount row
        if (discountRow) {
            if (discount > 0) {
                discountRow.style.display = 'flex';
                if (discountEl) discountEl.textContent = `-Rs. ${discount.toFixed(2)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }

        // Enable/disable checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = total <= 0;
        }
    }

    renderCart() {
        const container = document.getElementById('cartItemsContainer');
        const emptyCart = document.getElementById('emptyCart');
        const cartCount = document.getElementById('cart-count');

        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '';
            if (emptyCart) {
                container.appendChild(emptyCart);
            }
            if (cartCount) cartCount.textContent = '0';
            return;
        }

        // Hide empty cart message
        if (emptyCart) {
            emptyCart.style.display = 'none';
        }

        // Update cart count
        if (cartCount) {
            cartCount.textContent = this.items.reduce((total, item) => total + item.quantity, 0);
        }

        // Render cart items
        container.innerHTML = this.items.map(item => this.createCartItemHTML(item)).join('');
        
        // Bind events for quantity controls and remove buttons
        this.bindCartItemEvents();
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-description">${item.description}</p>
                    <div class="cart-item-meta">
                        <span>${item.weight}</span>
                        <span>${item.origin}</span>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="cart.updateQuantity('${item.id}', parseInt(this.value))">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">
                        ${item.originalPrice ? `<span class="original-price">Rs. ${item.originalPrice}</span>` : ''}
                        <span class="sale-price">Rs. ${item.salePrice}</span>
                    </div>
                    <button class="remove-item" onclick="cart.removeItem('${item.id}')" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindCartItemEvents() {
        // Quantity input validation
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('blur', (e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) {
                    e.target.value = 1;
                    const productId = e.target.closest('.cart-item').dataset.productId;
                    this.updateQuantity(productId, 1);
                }
            });
        });
    }

    updateCartCount() {
        // Update cart count in navigation (if exists)
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    saveCart() {
        localStorage.setItem('ceynatura-cart', JSON.stringify(this.items));
    }

    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Save coupon data to localStorage for payment page
        if (this.appliedCoupon) {
            localStorage.setItem('ceynatura-coupon', JSON.stringify(this.appliedCoupon));
        }

        // Show notification and redirect to payment page
        this.showNotification('Proceeding to checkout...', 'success');
        
        // Redirect to payment page after a short delay
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
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
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4a7c59',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        return colors[type] || colors.info;
    }
}

// Initialize cart when page loads
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new Cart();
});

// Global function to add items to cart (called from products page)
function addToCart(productData) {
    if (cart) {
        cart.addItem(productData);
    }
}

// Export cart instance for use in other scripts
window.cart = cart;
