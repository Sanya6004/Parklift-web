// Leaflet.js Map Implementation (Free & Open Source)

let map;
let markers = [];
let currentModalMap;

// Sample parking locations data
const parkingLocations = [
    {
        id: 1,
        name: "Connaught Place Parking",
        address: "Block E, Connaught Place, New Delhi",
        coordinates: [28.6328, 77.2197],
        price: "₹50/hour",
        slots: 45,
        type: "commercial",
        rating: 4.5,
        totalReviews: 128
    },
    {
        id: 2,
        name: "Rajiv Chowk Metro Parking",
        address: "Rajiv Chowk, New Delhi",
        coordinates: [28.6330, 77.2180],
        price: "₹40/hour",
        slots: 120,
        type: "metro",
        rating: 4.2,
        totalReviews: 256
    },
    {
        id: 3,
        name: "Palika Bazaar Parking",
        address: "Palika Bazaar, Connaught Place",
        coordinates: [28.6315, 77.2205],
        price: "₹60/hour",
        slots: 30,
        type: "commercial",
        rating: 4.0,
        totalReviews: 89
    },
    {
        id: 4,
        name: "Janpath Market Parking",
        address: "Janpath, New Delhi",
        coordinates: [28.6295, 77.2185],
        price: "₹45/hour",
        slots: 75,
        type: "commercial",
        rating: 4.3,
        totalReviews: 167
    },
    {
        id: 5,
        name: "Barakhamba Road Parking",
        address: "Barakhamba Road, New Delhi",
        coordinates: [28.6310, 77.2240],
        price: "₹55/hour",
        slots: 60,
        type: "commercial",
        rating: 4.1,
        totalReviews: 94
    }
];

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('parkingMap')) {
        initMap();
        loadParkingLocations();
    }
});

function initMap() {
    // Default center (Connaught Place, Delhi)
    const defaultCenter = [28.6328, 77.2197];
    
    // Create map
    map = L.map('parkingMap').setView(defaultCenter, 14);
    
    // Add OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add scale control
    L.control.scale().addTo(map);
    
    // Add all parking markers
    addAllMarkers();
    
    // Try to get user location
    getUserLocation();
}

function addAllMarkers() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Custom icon for parking
    const parkingIcon = L.divIcon({
        className: 'custom-marker',
        html: '<i class="fas fa-parking" style="color: white; background: var(--primary-color); padding: 8px; border-radius: 50%; font-size: 1.2rem;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    // Add markers for all locations
    parkingLocations.forEach(location => {
        const marker = L.marker(location.coordinates, { icon: parkingIcon }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="info-window">
                <h4>${location.name}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <p><i class="fas fa-tag"></i> ${location.price}</p>
                <p><i class="fas fa-parking"></i> Available: <strong>${location.slots} slots</strong></p>
                <p><i class="fas fa-star" style="color: gold;"></i> ${location.rating} (${location.totalReviews} reviews)</p>
                <button class="book-btn" onclick="bookParking(${location.id})">
                    <i class="fas fa-calendar-check"></i> Book Now
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const userLocation = [userLat, userLng];
                
                // Add marker for user location
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<i class="fas fa-circle" style="color: var(--primary-color); font-size: 1.5rem;"></i>',
                    iconSize: [20, 20]
                });
                
                L.marker(userLocation, { icon: userIcon })
                    .addTo(map)
                    .bindPopup('You are here')
                    .openPopup();
                
                // Center map on user location
                map.setView(userLocation, 15);
            },
            (error) => {
                console.log('Geolocation error:', error);
            }
        );
    }
}

function filterLocations(type) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter locations
    let filteredLocations = parkingLocations;
    if (type !== 'all') {
        filteredLocations = parkingLocations.filter(loc => loc.type === type);
    }
    
    // Clear all markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Add filtered markers
    const parkingIcon = L.divIcon({
        className: 'custom-marker',
        html: '<i class="fas fa-parking" style="color: white; background: var(--primary-color); padding: 8px; border-radius: 50%; font-size: 1.2rem;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    filteredLocations.forEach(location => {
        const marker = L.marker(location.coordinates, { icon: parkingIcon }).addTo(map);
        
        const popupContent = `
            <div class="info-window">
                <h4>${location.name}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <p><i class="fas fa-tag"></i> ${location.price}</p>
                <p><i class="fas fa-parking"></i> Available: <strong>${location.slots} slots</strong></p>
                <button class="book-btn" onclick="bookParking(${location.id})">
                    <i class="fas fa-calendar-check"></i> Book Now
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
}

function loadParkingLocations() {
    const container = document.getElementById('parkingLocations');
    if (!container) return;
    
    container.innerHTML = '';
    
    parkingLocations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <div class="map-preview" onclick="showOnMap('${location.name}', ${location.coordinates[0]}, ${location.coordinates[1]})"></div>
            <div class="location-info">
                <h3>${location.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <p><i class="fas fa-tag"></i> ${location.price}</p>
                <p><i class="fas fa-parking"></i> Available: <strong>${location.slots} slots</strong></p>
                <p>
                    <i class="fas fa-star" style="color: gold;"></i> ${location.rating} 
                    <span style="color: #999;">(${location.totalReviews} reviews)</span>
                </p>
                <div class="price">${location.price}</div>
                <button class="btn-view-map" onclick="openModal('${location.name}', ${location.coordinates[0]}, ${location.coordinates[1]})">
                    <i class="fas fa-map"></i> View on Map
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function showOnMap(name, lat, lng) {
    map.setView([lat, lng], 17);
    
    // Find and open popup for this location
    markers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        if (Math.abs(markerLatLng.lat - lat) < 0.001 && Math.abs(markerLatLng.lng - lng) < 0.001) {
            marker.openPopup();
        }
    });
}

function openModal(name, lat, lng) {
    document.getElementById('modalLocationName').textContent = name;
    document.getElementById('mapModal').classList.add('active');
    
    // Initialize modal map
    setTimeout(() => {
        if (currentModalMap) {
            currentModalMap.remove();
        }
        
        currentModalMap = L.map('modalMap').setView([lat, lng], 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(currentModalMap);
        
        // Add marker
        L.marker([lat, lng]).addTo(currentModalMap)
            .bindPopup(name)
            .openPopup();
    }, 100);
}

function closeModal() {
    document.getElementById('mapModal').classList.remove('active');
    if (currentModalMap) {
        currentModalMap.remove();
        currentModalMap = null;
    }
}

function bookParking(locationId) {
    const location = parkingLocations.find(l => l.id === locationId);
    if (location) {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            if (confirm('Please login to book parking. Would you like to login now?')) {
                window.location.href = '/login';
            }
            return;
        }
        
        alert(`✅ Booking confirmed at ${location.name}!\n📍 Address: ${location.address}\n💰 Price: ${location.price}\n🅿️ Available Slots: ${location.slots}`);
        // In real app, redirect to booking page
        // window.location.href = `/booking?id=${locationId}`;
    }
}

// Search functionality
document.getElementById('mapSearch')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    const filtered = parkingLocations.filter(location => 
        location.name.toLowerCase().includes(searchTerm) ||
        location.address.toLowerCase().includes(searchTerm)
    );
    
    // Update markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    const parkingIcon = L.divIcon({
        className: 'custom-marker',
        html: '<i class="fas fa-parking" style="color: white; background: var(--primary-color); padding: 8px; border-radius: 50%; font-size: 1.2rem;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    filtered.forEach(location => {
        const marker = L.marker(location.coordinates, { icon: parkingIcon }).addTo(map);
        
        const popupContent = `
            <div class="info-window">
                <h4>${location.name}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <p><i class="fas fa-tag"></i> ${location.price}</p>
                <button class="book-btn" onclick="bookParking(${location.id})">Book Now</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
});