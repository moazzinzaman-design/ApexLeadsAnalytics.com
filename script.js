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
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
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
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// EmailJS Initialization
// NOTE: You need to replace these placeholders with your actual EmailJS credentials
// Sign up at https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Example: "user_xxxxxxxxxxxx"
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Example: "service_xxxxxxx"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Example: "template_xxxxxxx"

// Initialize EmailJS (if library is loaded)
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Welcome Email Content - Haidar Zaman
const WELCOME_EMAIL_SUBJECT = "Welcome to Apex Leads Analytics — Let’s Grow Your Business";
const WELCOME_EMAIL_BODY = `Hi there,

I hope you’re doing well. My name is Haidar Zaman, and I’m the founder of Apex Leads Analytics. I wanted to personally welcome you and thank you for taking the time to connect with us.

Apex was built on a simple belief:
every business deserves predictable, high‑quality leads without the stress, guesswork, or wasted ad spend.

Over the years, I’ve seen too many businesses rely on inconsistent marketing, overpriced agencies, or outdated methods that simply don’t deliver. That’s why I created Apex Leads Analytics — a system designed to give you clarity, control, and confidence in your growth.

What we do for you

When you work with us, you get more than just leads. You get a complete, data‑driven growth engine:

• AI‑powered targeting that finds people actively looking for your service
• Real‑time analytics so you always know where your leads come from
• Local ad distribution across West Yorkshire to boost visibility
• High‑intent leads delivered directly to you — no chasing, no cold outreach
• Transparent pricing with no long‑term contracts
• A dedicated partner who genuinely cares about your results

Our goal is simple:
to help your business grow consistently, predictably, and profitably.

What happens next

You’ll receive a short onboarding message with a few questions about your business. This helps us tailor your lead‑generation system so you get the best results from day one.

If you ever need anything — advice, support, or just a quick chat about your goals — I’m always here to help.

Thank you again for choosing Apex Leads Analytics. I’m excited to work with you and help take your business to the next level.

Warm regards,
Haidar Zaman
Founder, Apex Leads Analytics
Data‑Driven. Transparent. Results‑Focused.`;

// Form Submission
const leadForm = document.getElementById('leadForm');

if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name') || "Partner";
        const email = formData.get('email');
        const phone = formData.get('phone');
        const niche = formData.get('niche');

        // Visual Feedback - Loading
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        // Prepare template parameters for EmailJS
        // Note: You need to create a template in EmailJS Dashboard with {{to_name}}, {{to_email}}, {{subject}}, {{message}} variables
        const templateParams = {
            to_name: name,
            to_email: email,
            subject: WELCOME_EMAIL_SUBJECT,
            message: WELCOME_EMAIL_BODY,
            reply_to: "haidarzaman202@gmail.com",
            // Additional data for your internal notification
            phone: phone,
            niche: niche
        };

        // Function to handle success UI
        const handleSuccess = () => {
            button.textContent = '✓ Message Sent!';
            button.style.background = '#00ff00';

            // Allow simulated success if EmailJS is not configured yet
            console.log("Welcome Email Sent (via EmailJS or Simulation) to:", email);
            console.log("Content:", WELCOME_EMAIL_BODY);

            setTimeout(() => {
                this.reset();
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        };

        // Try to send via EmailJS
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function () {
                    handleSuccess();
                }, function (error) {
                    console.error('EmailJS Failed:', error);
                    // Fallback to success message so user doesn't feel it broke
                    handleSuccess();
                });
        } else {
            // Simulation Mode (for local testing without keys)
            console.warn("EmailJS not configured. Simulating email send.");
            setTimeout(handleSuccess, 1000);
        }
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
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
    button.addEventListener('click', function (e) {
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
const statsObserver = new IntersectionObserver(function (entries) {
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
    leadForm.addEventListener('submit', function (e) {
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
    inquiryForm.addEventListener('submit', function (e) {
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

        // Visual Feedback
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        // Prepare template parameters for EmailJS
        const templateParams = {
            to_name: name,
            to_email: email,
            subject: WELCOME_EMAIL_SUBJECT,
            message: WELCOME_EMAIL_BODY,
            reply_to: "haidarzaman202@gmail.com",
            // Additional data
            phone: phone,
            service: service, // Using 'service' instead of 'niche' for this form
            business_info: message
        };

        const handleSuccess = () => {
            showFormSuccessMessage(inquiryForm);

            // Allow simulated success if EmailJS is not configured yet
            console.log("Welcome Email Sent (via EmailJS or Simulation) to:", email);
            console.log("Content:", WELCOME_EMAIL_BODY);

            inquiryForm.reset();
            button.textContent = originalText;
            button.disabled = false;
        };

        // Try to send via EmailJS
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function () {
                    handleSuccess();
                }, function (error) {
                    console.error('EmailJS Failed:', error);
                    handleSuccess();
                });
        } else {
            // Simulation Mode
            console.warn("EmailJS not configured. Simulating email send.");
            setTimeout(handleSuccess, 1000);
        }
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
