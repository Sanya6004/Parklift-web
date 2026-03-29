// Authentication JavaScript for ParkLift

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate login - In real app, this would call your backend
            showAlert('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        });
    }
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname')?.value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone')?.value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            const city = document.getElementById('city')?.value;
            const terms = document.querySelector('input[name="terms"]')?.checked;
            
            // Validation
            if (!fullname || !email || !phone || !password || !confirmPassword || !city) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showAlert('Please enter a valid phone number', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long!', 'error');
                return;
            }
            
            if (!terms) {
                showAlert('Please agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            // Simulate registration
            showAlert('Account created successfully! Please login.', 'success');
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        });
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Show alert message
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at top of form
    const form = document.querySelector('.auth-form');
    form.insertBefore(alert, form.firstChild);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Forgot password
function forgotPassword() {
    const email = prompt('Please enter your email address:');
    
    if (email) {
        if (isValidEmail(email)) {
            showAlert('Password reset link sent to your email!', 'success');
        } else {
            showAlert('Please enter a valid email address', 'error');
        }
    }
}

// Google sign in/up
function googleAuth() {
    showAlert('Connecting to Google...', 'info');
    // In real app, this would redirect to Google OAuth
    setTimeout(() => {
        showAlert('Google authentication coming soon!', 'info');
    }, 1500);
}