// Map Integration for ParkLift

let map;
let userMarker;
let parkingMarkers = [];
let selectedParkingId = null;

// Sample parking data
const parkingSpots = [
    {
        id: 1,
        name: "Connaught Place Parking",
        address: "Block E, Connaught Place, New Delhi",
        lat: 28.6328,
        lng: 77.2197,
        price: 50,
        totalSlots: 100,
        availableSlots: 45,
        type: "commercial",
        rating: 4.5
    },
    {
        id: 2,
        name: "Rajiv Chowk Metro Parking",
        address: "Rajiv Chowk, New Delhi",
        lat: 28.6330,
        lng: 77.2180,
        price: 40,
        totalSlots: 200,
        availableSlots: 120,
        type: "metro",
        rating: 4.2
    },
    {
        id: 3,
        name: "Palika Bazaar Parking",
        address: "Palika Bazaar, Connaught Place",
        lat: 28.6315,
        lng: 77.2205,
        price: 60,
        totalSlots: 80,
        availableSlots: 30,
        type: "commercial",
        rating: 4.0
    },
    {
        id: 4,
        name: "Janpath Market Parking",
        address: "Janpath, New Delhi",
        lat: 28.6295,
        lng: 77.2185,
        price: 45,
        totalSlots: 150,
        availableSlots: 75,
        type: "commercial",
        rating: 4.3
    },
    {
        id: 5,
        name: "Barakhamba Road Parking",
        address: "Barakhamba Road, New Delhi",
        lat: 28.6310,
        lng: 77.2240,
        price: 55,
        totalSlots: 120,
        availableSlots: 60,
        type: "commercial",
        rating: 4.1
    }
];

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('fullMap')) {
        initFullMap();
    } else if (document.getElementById('liveMapPreview')) {
        initPreviewMap();
    }
});

// Initialize full map (find-parking page)
function initFullMap() {
    // Default to Delhi center
    const defaultCenter = [28.6328, 77.2197];
    
    map = L.map('fullMap').setView(defaultCenter, 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Try to get user location automatically
    setTimeout(() => {
        if (navigator.geolocation) {
            requestLocation();
        }
    }, 1000);
}

// Initialize preview map (dashboard)
function initPreviewMap() {
    const defaultCenter = [28.6328, 77.2197];
    
    map = L.map('liveMapPreview').setView(defaultCenter, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Try to get user location
    if (navigator.geolocation) {
        requestLocation();
    }
}

// Center map on user location
function centerMapOnUser(location) {
    if (!map) return;
    
    map.setView([location.lat, location.lng], 15);
    
    // Add or update user marker
    if (userMarker) {
        userMarker.setLatLng([location.lat, location.lng]);
    } else {
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<i class="fas fa-circle" style="color: var(--primary-color); font-size: 1.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"></i>',
            iconSize: [24, 24]
        });
        
        userMarker = L.marker([location.lat, location.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('You are here');
    }
}

// Show default map (when location denied)
function showDefaultMap() {
    if (!map) return;
    
    map.setView([28.6328, 77.2197], 13);
    
    // Load all parking spots
    loadAllParkingSpots();
}

// Load nearby parking spots
function loadNearbyParking(userLocation) {
    // Calculate distances and sort
    const spotsWithDistance = parkingSpots.map(spot => ({
        ...spot,
        distance: calculateDistance(
            userLocation.lat, userLocation.lng,
            spot.lat, spot.lng
        )
    }));
    
    // Sort by distance
    spotsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Update map markers
    updateParkingMarkers(spotsWithDistance);
    
    // Update sidebar
    updateParkingList(spotsWithDistance);
}

// Load all parking spots (when location not available)
function loadAllParkingSpots() {
    updateParkingMarkers(parkingSpots);
    updateParkingList(parkingSpots);
}

// Update parking markers on map
function updateParkingMarkers(spots) {
    // Clear existing markers
    parkingMarkers.forEach(marker => map.removeLayer(marker));
    parkingMarkers = [];
    
    // Custom icon for parking
    const parkingIcon = L.divIcon({
        className: 'parking-marker',
        html: '<i class="fas fa-parking" style="color: white; background: var(--primary-color); padding: 8px; border-radius: 50%; font-size: 1.2rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></i>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
    
    spots.forEach(spot => {
        const marker = L.marker([spot.lat, spot.lng], { icon: parkingIcon }).addTo(map);
        
        // Create popup
        const popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: var(--dark-color);">${spot.name}</h4>
                <p style="margin: 5px 0;"><i class="fas fa-map-marker-alt"></i> ${spot.address}</p>
                <p style="margin: 5px 0;"><i class="fas fa-tag"></i> ₹${spot.price}/hour</p>
                <p style="margin: 5px 0;"><i class="fas fa-parking"></i> Available: <strong>${spot.availableSlots}/${spot.totalSlots}</strong></p>
                ${spot.distance ? `<p style="margin: 5px 0;"><i class="fas fa-location-dot"></i> ${spot.distance} km away</p>` : ''}
                <button onclick="selectParking(${spot.id})" 
                        style="background: var(--primary-color); color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-top: 10px; cursor: pointer; width: 100%;">
                    Book Now
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('click', () => {
            selectParking(spot.id);
        });
        
        parkingMarkers.push(marker);
    });
}

// Update parking list in sidebar
function updateParkingList(spots) {
    const parkingList = document.getElementById('parkingList');
    const resultCount = document.getElementById('resultCount');
    
    if (!parkingList) return;
    
    if (resultCount) {
        resultCount.textContent = `${spots.length} spots`;
    }
    
    parkingList.innerHTML = '';
    
    spots.forEach(spot => {
        const availabilityPercent = (spot.availableSlots / spot.totalSlots) * 100;
        
        const item = document.createElement('div');
        item.className = `parking-item ${selectedParkingId === spot.id ? 'selected' : ''}`;
        item.onclick = () => selectParking(spot.id);
        
        item.innerHTML = `
            <div class="parking-item-header">
                <span class="parking-name">${spot.name}</span>
                ${spot.distance ? `<span class="parking-distance">${spot.distance} km</span>` : ''}
            </div>
            <div class="parking-address">
                <i class="fas fa-map-marker-alt"></i> ${spot.address}
            </div>
            <div class="parking-details">
                <span><i class="fas fa-star" style="color: gold;"></i> ${spot.rating}</span>
                <span><i class="fas fa-car"></i> ${spot.availableSlots} left</span>
            </div>
            <div class="parking-price">₹${spot.price}/hour</div>
            <div class="availability-bar">
                <div class="availability-fill" style="width: ${availabilityPercent}%"></div>
            </div>
            <div class="slots-left">${spot.availableSlots} of ${spot.totalSlots} slots available</div>
            <button class="btn-select-spot" onclick="event.stopPropagation(); openBookingModal(${spot.id})">
                Select Spot
            </button>
        `;
        
        parkingList.appendChild(item);
    });
}

// Select parking spot
function selectParking(id) {
    selectedParkingId = id;
    
    // Highlight selected item
    document.querySelectorAll('.parking-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    const selectedItem = Array.from(document.querySelectorAll('.parking-item')).find(
        item => item.onclick.toString().includes(id)
    );
    
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
    
    // Find and center on the spot
    const spot = parkingSpots.find(s => s.id === id);
    if (spot && map) {
        map.setView([spot.lat, spot.lng], 17);
        
        // Open popup
        parkingMarkers.forEach(marker => {
            const latLng = marker.getLatLng();
            if (Math.abs(latLng.lat - spot.lat) < 0.001 && Math.abs(latLng.lng - spot.lng) < 0.001) {
                marker.openPopup();
            }
        });
    }
}

// Filter parking spots
function filterParking(type) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filteredSpots = [...parkingSpots];
    
    if (type === 'available') {
        filteredSpots = filteredSpots.filter(spot => spot.availableSlots > 0);
    } else if (type === 'nearby' && userLocation) {
        filteredSpots = filteredSpots.map(spot => ({
            ...spot,
            distance: calculateDistance(
                userLocation.lat, userLocation.lng,
                spot.lat, spot.lng
            )
        }));
        filteredSpots.sort((a, b) => a.distance - b.distance);
    } else if (type === 'cheapest') {
        filteredSpots.sort((a, b) => a.price - b.price);
    }
    
    updateParkingMarkers(filteredSpots);
    updateParkingList(filteredSpots);
}

// Open booking modal
function openBookingModal(spotId) {
    const spot = parkingSpots.find(s => s.id === spotId);
    if (!spot) return;
    
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('bookingModalBody');
    
    const now = new Date();
    const currentTime = now.toTimeString().slice(0,5);
    const endTime = new Date(now.getTime() + 2*60*60*1000).toTimeString().slice(0,5);
    
    modalBody.innerHTML = `
        <div class="booking-details">
            <h4>${spot.name}</h4>
            <p><i class="fas fa-map-marker-alt"></i> ${spot.address}</p>
            <p><i class="fas fa-tag"></i> ₹${spot.price}/hour</p>
            <p><i class="fas fa-parking"></i> Available: ${spot.availableSlots} slots</p>
            
            <div class="time-selection">
                <label>Select Time:</label>
                <div class="time-inputs">
                    <input type="time" id="startTime" value="${currentTime}">
                    <span>to</span>
                    <input type="time" id="endTime" value="${endTime}">
                </div>
            </div>
            
            <div class="vehicle-selection">
                <label>Select Vehicle:</label>
                <div class="vehicle-options">
                    <div class="vehicle-option selected" onclick="selectVehicle(this, 'Car')">
                        <i class="fas fa-car"></i> Car
                    </div>
                    <div class="vehicle-option" onclick="selectVehicle(this, 'Bike')">
                        <i class="fas fa-motorcycle"></i> Bike
                    </div>
                    <div class="vehicle-option" onclick="selectVehicle(this, 'SUV')">
                        <i class="fas fa-truck"></i> SUV
                    </div>
                </div>
            </div>
            
            <div class="price-breakdown">
                <div class="price-row">
                    <span>Base Price (₹${spot.price}/hr × 2 hrs)</span>
                    <span>₹${spot.price * 2}</span>
                </div>
                <div class="price-row">
                    <span>GST (18%)</span>
                    <span>₹${Math.round(spot.price * 2 * 0.18)}</span>
                </div>
                <div class="price-row total">
                    <span>Total</span>
                    <span>₹${Math.round(spot.price * 2 * 1.18)}</span>
                </div>
            </div>
            
            <button class="btn-confirm-booking" onclick="confirmBooking(${spot.id})">
                Confirm Booking
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

// Select vehicle
function selectVehicle(element, type) {
    document.querySelectorAll('.vehicle-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

// ===== 🎉 CONFETTI FUNCTION - YAHAN PE ADD KARO =====
function confirmBooking(spotId) {
    const spot = parkingSpots.find(s => s.id === spotId);
    const startTime = document.getElementById('startTime')?.value;
    const endTime = document.getElementById('endTime')?.value;
    
    // Your booking logic here
    console.log('Booking confirmed:', { spotId, startTime, endTime });
    
    // Show success notification
    showNotification('Booking confirmed successfully!', 'success');
    
    // Show confetti
    showConfetti();
    
    // Show success checkmark
    showSuccessCheckmark();
    
    // Close modal
    closeBookingModal();
    
    // Redirect to my bookings after 2 seconds
    setTimeout(() => {
        window.location.href = '/my-bookings';
    }, 2000);
}

// Book now function for dashboard
function bookNow(spotId) {
    window.location.href = `/find-parking?id=${spotId}`;
}

// Update user location in real-time
function updateUserLocation(location) {
    if (userMarker) {
        userMarker.setLatLng([location.lat, location.lng]);
    }
    
    // Refresh nearby spots if on find-parking page
    if (window.location.pathname === '/find-parking') {
        loadNearbyParking(location);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
}

// Load user data on page load
document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName') || 'John Doe';
    const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
    
    userNameElements.forEach(el => {
        if (el) el.textContent = userName.split(' ')[0] + '!';
    });
    
    // User menu toggle
    const userMenuBtn = document.querySelector('.user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        const dropdowns = document.querySelectorAll('.user-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    });
});