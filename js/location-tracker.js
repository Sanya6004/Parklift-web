// Location Tracker for ParkLift

let userLocation = null;
let locationWatchId = null;
let locationPermission = false;

// Request user location
function requestLocation() {
    const locationBtn = document.getElementById('locationBtn');
    const locationStatus = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        showLocationError('Geolocation is not supported by your browser');
        return;
    }
    
    locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
    locationBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            locationPermission = true;
            
            // Update button
            locationBtn.innerHTML = '<i class="fas fa-check-circle"></i> Location Enabled';
            locationBtn.style.background = 'var(--secondary-color)';
            
            // Update status
            if (locationStatus) {
                locationStatus.innerHTML = `
                    <i class="fas fa-check-circle" style="color: #2e7d32;"></i>
                    <span style="color: #2e7d32;">Location detected! Showing nearby parking spots.</span>
                `;
                locationStatus.style.background = '#e8f5e9';
            }
            
            // Center map on user location
            if (typeof centerMapOnUser === 'function') {
                centerMapOnUser(userLocation);
            }
            
            // Load nearby parking spots
            if (typeof loadNearbyParking === 'function') {
                loadNearbyParking(userLocation);
            }
            
            console.log('Location detected:', userLocation);
        },
        // Error callback
        (error) => {
            let errorMessage = 'Unable to get your location';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location permission denied. Please enable location access.';
                    locationPermission = false;
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
            }
            
            showLocationError(errorMessage);
            
            // Reset button
            locationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Enable Location';
            locationBtn.disabled = false;
            locationBtn.style.background = 'var(--primary-color)';
            
            // Show default map (Delhi center)
            if (typeof showDefaultMap === 'function') {
                showDefaultMap();
            }
        },
        // Options
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
    
    // Start watching position for real-time updates
    if (locationWatchId === null) {
        locationWatchId = navigator.geolocation.watchPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Update map with new location
                if (typeof updateUserLocation === 'function') {
                    updateUserLocation(userLocation);
                }
            },
            (error) => {
                console.log('Watch position error:', error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000
            }
        );
    }
}

// Show location error
function showLocationError(message) {
    const locationStatus = document.getElementById('locationStatus');
    
    if (locationStatus) {
        locationStatus.innerHTML = `
            <i class="fas fa-exclamation-circle" style="color: #d32f2f;"></i>
            <span style="color: #d32f2f;">${message}</span>
        `;
        locationStatus.style.background = '#ffebee';
    }
    
    // Show alert for first time
    if (!localStorage.getItem('locationAlertShown')) {
        alert(message + ' Showing default map of Delhi.');
        localStorage.setItem('locationAlertShown', 'true');
    }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal
}

// Get user location status
function isLocationEnabled() {
    return locationPermission;
}

// Stop watching location
function stopWatchingLocation() {
    if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }
}

// Check if location is already enabled on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with map
    if (document.getElementById('fullMap') || document.getElementById('liveMapPreview')) {
        // Check if permission was already given
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
                if (result.state === 'granted') {
                    // Permission already granted, auto-detect
                    setTimeout(requestLocation, 500);
                } else if (result.state === 'prompt') {
                    // Will prompt on click
                    console.log('Location permission will be requested on click');
                } else if (result.state === 'denied') {
                    showLocationError('Location access denied. Please enable in browser settings.');
                }
            });
        }
    }
});