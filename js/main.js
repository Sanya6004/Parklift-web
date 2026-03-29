// Main JavaScript for ParkLift

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Highlight active navigation link
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.value-card, .team-card, .stat-item, .timeline-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial styles for animation
    const animatedElements = document.querySelectorAll('.value-card, .team-card, .stat-item, .timeline-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run animation on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

// Mobile menu toggle (to be implemented when adding mobile menu)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Scroll to top button
window.onscroll = function() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;
    
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scrollTop';
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--primary-color);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: none;
    font-size: 1.2rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    z-index: 999;
`;
scrollBtn.onmouseover = function() {
    this.style.background = 'var(--secondary-color)';
    this.style.transform = 'translateY(-3px)';
};
scrollBtn.onmouseout = function() {
    this.style.background = 'var(--primary-color)';
    this.style.transform = 'translateY(0)';
};
scrollBtn.onclick = scrollToTop;
document.body.appendChild(scrollBtn);