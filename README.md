# CeyNatura - Premium Ceylon Spices Website

A modern, responsive website for CeyNatura, showcasing premium Ceylon spices with beautiful animations and user-friendly design.

## 🌟 Features

### Design & Branding
- **Logo Integration**: Custom animated logo matching your CeyNatura brand
- **Color Scheme**: Dark green, brown, and beige palette matching your logo
- **Typography**: Professional fonts (Playfair Display & Poppins)
- **Responsive Design**: Works perfectly on all devices (desktop, tablet, mobile)

### Interactive Elements
- **Smooth Animations**: Fade-in effects, hover animations, and parallax scrolling
- **Mobile Menu**: Hamburger menu for mobile devices
- **Scroll to Top**: Animated button that appears when scrolling
- **Product Cards**: Interactive cards with hover effects and "Add to Cart" functionality
- **Contact Form**: Functional form with validation and success notifications

### Sections
1. **Hero Section**: Eye-catching landing with animated spice jars
2. **Features**: Three-column layout highlighting product benefits
3. **Products**: Grid layout showcasing Ceylon spices with pricing
4. **About**: Company description with animated badges
5. **Contact**: Contact information and functional contact form
6. **Footer**: Complete footer with links and social media

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Local web server (optional, for development)

### Installation
1. Download all files to your web server directory
2. Open `index.html` in your browser
3. The website is ready to use!

### File Structure
```
ceynatura/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Customization

### Colors
The website uses CSS custom properties for easy color customization:

```css
:root {
    --primary-green: #2d5016;    /* Main brand color */
    --secondary-green: #4a7c59;  /* Secondary green */
    --accent-brown: #8b4513;     /* Brown accent */
    --light-beige: #f5f5dc;      /* Light background */
    --dark-beige: #e8e4d9;       /* Dark background */
}
```

### Products
To add or modify products, edit the products section in `index.html`:

```html
<div class="product-card">
    <div class="product-badge">Sale!</div>
    <div class="product-image">
        <img src="your-image-url" alt="Product Name">
    </div>
    <div class="product-info">
        <h3>Product Name</h3>
        <div class="product-price">
            <span class="original-price">Rs. 450.00</span>
            <span class="sale-price">Rs. 380.00</span>
        </div>
        <button class="add-to-cart">Add to Cart</button>
    </div>
</div>
```

### Content
- **Company Information**: Update the about section with your company details
- **Contact Information**: Modify contact details in the contact section
- **Social Media**: Update social media links in the footer

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

### Mobile Features
- Collapsible navigation menu
- Touch-friendly buttons and interactions
- Optimized layouts for small screens
- Fast loading with optimized images

## 🎭 Animations

### CSS Animations
- **Logo Float**: Gentle floating animation for the logo
- **Fade-in Effects**: Elements appear with smooth transitions
- **Hover Effects**: Interactive hover states for cards and buttons
- **Parallax**: Subtle parallax effect on the hero section

### JavaScript Animations
- **Scroll Animations**: Elements animate when scrolled into view
- **Button Ripple**: Material design-style ripple effect on button clicks
- **Loading Animations**: Smooth page load transitions
- **Notification System**: Animated notifications for user actions

## 🔧 Technical Features

### Performance
- **Optimized Images**: Using Unsplash CDN for fast loading
- **Debounced Scroll Events**: Smooth performance during scrolling
- **Lazy Loading**: Images load as needed
- **Minimal Dependencies**: Only Font Awesome for icons

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper semantic HTML
- **Focus Indicators**: Clear focus states for navigation
- **Alt Text**: Descriptive alt text for images

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📞 Contact Form

The contact form includes:
- **Form Validation**: Client-side validation for all fields
- **Success Feedback**: Visual feedback when form is submitted
- **Error Handling**: Clear error messages for invalid inputs
- **Accessibility**: Proper labels and ARIA attributes

## 🛒 E-commerce Ready

The website is prepared for e-commerce integration:
- **Product Cards**: Ready for shopping cart integration
- **Add to Cart**: Functional buttons with animations
- **Pricing Display**: Clear pricing with sale indicators
- **Product Categories**: Easy to organize products

## 🎯 SEO Optimized

- **Semantic HTML**: Proper heading structure and semantic elements
- **Meta Tags**: Ready for SEO meta tags
- **Fast Loading**: Optimized for search engine ranking
- **Mobile First**: Google's mobile-first indexing ready

## 🔄 Future Enhancements

Potential additions:
- **Shopping Cart**: Full e-commerce functionality
- **Product Filtering**: Category and price filters
- **User Reviews**: Customer review system
- **Newsletter Signup**: Email marketing integration
- **Blog Section**: Content marketing capabilities
- **Multi-language**: Internationalization support

## 📄 License

This website template is created for CeyNatura. Feel free to customize and modify as needed for your business requirements.

## 🤝 Support

For any questions or customization requests, please contact your web developer or the CeyNatura team.

---

**CeyNatura** - Bringing the authentic taste of Ceylon spices to your kitchen worldwide. 