// Navigation JavaScript for ParkLift

// Active link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if current page matches link
        if (currentPage === linkPath || 
            (currentPage === '/' && linkPath === '/') ||
            (linkPath !== '/' && currentPage.startsWith(linkPath))) {
            link.classList.add('active');
        }
    });
});

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    // Add mobile menu button for smaller screens
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
        nav.insertBefore(menuToggle, navLinks);
    }
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        this.innerHTML = navLinks.classList.contains('show') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when window resizes to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('show');
            if (document.querySelector('.mobile-menu-toggle')) {
                document.querySelector('.mobile-menu-toggle').remove();
            }
        } else if (!document.querySelector('.mobile-menu-toggle')) {
            nav.insertBefore(menuToggle, navLinks);
        }
    });
}

// Initialize mobile menu if needed
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
}

// Dropdown menu for user account
function createUserMenu() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navLinks = document.querySelector('.nav-links');
    
    if (isLoggedIn) {
        // Replace login button with user menu
        const loginBtn = document.querySelector('.btn-get-started');
        if (loginBtn) {
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <button class="user-menu-btn">
                    <i class="fas fa-user-circle"></i>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown">
                    <a href="/dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="/profile"><i class="fas fa-user"></i> Profile</a>
                    <a href="/bookings"><i class="fas fa-calendar-check"></i> My Bookings</a>
                    <a href="/settings"><i class="fas fa-cog"></i> Settings</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            `;
            
            loginBtn.replaceWith(userMenu);
            
            // Toggle dropdown
            const menuBtn = userMenu.querySelector('.user-menu-btn');
            const dropdown = userMenu.querySelector('.user-dropdown');
            
            menuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                dropdown.classList.remove('show');
            });
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
}

// Initialize user menu
document.addEventListener('DOMContentLoaded', createUserMenu);