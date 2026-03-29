// Dashboard JavaScript

// Switch between booking tabs
function switchTab(tab) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Here you would load different bookings based on tab
    console.log('Switching to', tab, 'bookings');
}

// Extend booking
function extendBooking(bookingId) {
    alert(`Extend booking ${bookingId}? This feature is coming soon!`);
}

// Cancel booking
function cancelBooking(bookingId) {
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
        alert(`Booking ${bookingId} cancelled successfully!`);
        // Remove the booking item from UI
        event.target.closest('.booking-item').remove();
    }
}

// Modify booking
function modifyBooking(bookingId) {
    alert(`Modify booking ${bookingId}? This feature is coming soon!`);
}

// View booking details
function viewBooking(bookingId) {
    alert(`Viewing details for booking ${bookingId}`);
    // Redirect to booking details page
    // window.location.href = `/booking-details?id=${bookingId}`;
}

// Rebook a previous booking
function rebook(bookingId) {
    alert(`Rebooking from ${bookingId}`);
    window.location.href = '/find-parking';
}

// Write review
function writeReview(bookingId) {
    const rating = prompt('Rate your experience (1-5 stars):', '5');
    if (rating) {
        alert(`Thank you for your ${rating}-star review!`);
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Redirect to login
        window.location.href = '/login';
    }
    
    // Load user data
    const userName = localStorage.getItem('userName') || 'John Doe';
    const userEmail = localStorage.getItem('userEmail') || 'john@example.com';
    
    document.querySelectorAll('#userName, #welcomeUserName').forEach(el => {
        if (el) el.textContent = userName.split(' ')[0];
    });
});