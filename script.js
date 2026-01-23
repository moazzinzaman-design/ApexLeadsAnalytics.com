// Create Enhanced Particle Effects for Logo
function createLogoParticles() {
    const particleContainer = document.querySelector('.logo-particles');
    if (!particleContainer) return;

    // Create multiple floating particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = '#00d4ff';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px #00d4ff';
        particle.style.pointerEvents = 'none';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.animation = `particleOrbit ${4 + i * 0.5}s linear infinite`;
        particle.style.transformOrigin = '120px 0px';
        particle.style.transform = `rotate(${(i / 8) * 360}deg) translateX(120px)`;
        
        particleContainer.appendChild(particle);
    }
}

// Add particle orbit animation
const orbitalStyle = document.createElement('style');
orbitalStyle.textContent = `
    @keyframes particleOrbit {
        0% {
            opacity: 1;
            transform: rotate(0deg) translateX(120px);
        }
        100% {
            opacity: 0.3;
            transform: rotate(360deg) translateX(120px);
        }
    }
`;
document.head.appendChild(orbitalStyle);

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scroll
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Handle scroll-link click events
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Form Submission
const leadForm = document.getElementById('leadForm');

if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            niche: formData.get('niche'),
            message: formData.get('message')
        };

        // Get all input values
        const inputs = this.querySelectorAll('input, textarea, select');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const phone = inputs[2].value;
        const niche = inputs[3].value;
        const message = inputs[4].value;

        // Show success message
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '✓ Message Sent!';
        button.style.background = '#00ff00';

        // Reset form
        setTimeout(() => {
            this.reset();
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);

        // In a real application, you would send this data to your backend
        console.log('Form submitted with data:', {
            name,
            email,
            phone,
            niche,
            message
        });
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all step cards, service cards, pricing cards
document.querySelectorAll('.step-card, .service-card, .pricing-card, .revenue-card, .testimonial-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add fade-in-up animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Active navbar link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#00d4ff';
        } else {
            link.style.color = '#a0aec0';
        }
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripples = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripples.style.width = ripples.style.height = size + 'px';
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple');

        // Add ripple styling
        const ripplesStyle = document.createElement('style');
        ripplesStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }

            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        if (!document.querySelector('style[data-ripple]')) {
            ripplesStyle.setAttribute('data-ripple', 'true');
            document.head.appendChild(ripplesStyle);
        }

        this.appendChild(ripples);
    });
});

// Counter animation for stats
function animateCounter(element, target) {
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Trigger counter animation when stats section is in view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.stat-card h3');
            cards.forEach(card => {
                const text = card.textContent.replace(/[£%]/g, '');
                const num = parseInt(text);
                if (!isNaN(num)) {
                    animateCounter(card, num);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Typing effect for hero title
function typeEffect(element, speed = 50) {
    const text = element.textContent;
    element.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Apply typing effect on page load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent.length > 0) {
        // Uncomment below for typing effect (can be slow for long titles)
        // typeEffect(heroTitle, 30);
    }
});

// Newsletter/Email capture with validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone number validation
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone);
}

// Form validation
if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        const inputs = this.querySelectorAll('input, textarea, select');
        const email = inputs[1].value;
        const phone = inputs[2].value;

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            e.preventDefault();
            return;
        }

        if (!validatePhone(phone)) {
            alert('Please enter a valid phone number');
            e.preventDefault();
            return;
        }
    });
}

// Add scroll-to-top button
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
        color: #0a0e27;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        font-size: 1.2rem;
        box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
    });
}

addScrollToTopButton();

// Add subtle mouse follow effect to hero background
document.addEventListener('mousemove', (e) => {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        heroBackground.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
    }
});

// Initialize logo particles on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLogoParticles);
} else {
    createLogoParticles();
}

// Handle Inquiry Form Submission
const inquiryForm = document.getElementById('inquiryForm');
if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();
        
        // Validate form data
        if (!name || !email || !phone || !service || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Validate phone format (basic validation for international format)
        const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid phone number.');
            return;
        }
        
        // Create email body
        const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Service Interest: ${service}

Business Information:
${message}

---
This inquiry was submitted from the service page.
        `.trim();
        
        // Create mailto link (you can replace with actual backend API call)
        const subject = `Service Inquiry - ${service}`;
        const mailtoLink = `mailto:inquiries@apexleadsanalytics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // For production, you should use a proper backend API
        // For now, we'll show a success message and optionally open email client
        showFormSuccessMessage(inquiryForm);
        
        // Uncomment the line below to open email client (optional)
        // window.location.href = mailtoLink;
        
        // Reset form
        inquiryForm.reset();
    });
}

function showFormSuccessMessage(form) {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
        color: #000;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    successMessage.innerHTML = `
        <div>Thank you for your inquiry!</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">We'll get back to you within 24 hours.</div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove message after 4 seconds
    setTimeout(() => {
        successMessage.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 4000);
}

console.log('Apex Leads Analytics website loaded successfully!');
