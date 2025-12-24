// Africa Map Tracker - Main JavaScript File

// Initialize data storage
function initializeData() {
    if (!localStorage.getItem('africaMapData')) {
        const sampleData = {
            registrations: [
                { id: 1, country: "Nigeria", name: "Demo User", message: "Welcome to the African Origins Map!", timestamp: new Date().toISOString() }
            ]
        };
        localStorage.setItem('africaMapData', JSON.stringify(sampleData));
    }
}

// Get all registrations
function getRegistrations() {
    const data = JSON.parse(localStorage.getItem('africaMapData') || '{"registrations":[]}');
    return data.registrations;
}

// Get country counts
function getCountryCounts() {
    const registrations = getRegistrations();
    const counts = {};
    
    registrations.forEach(reg => {
        const country = reg.country;
        counts[country] = (counts[country] || 0) + 1;
    });
    
    return counts;
}

// Update statistics display
function updateStats() {
    const registrations = getRegistrations();
    const countryCounts = getCountryCounts();
    
    // Update total participants
    const totalElement = document.getElementById('totalParticipants');
    if (totalElement) {
        totalElement.textContent = registrations.length;
    }
    
    // Update unique countries
    const uniqueElement = document.getElementById('uniqueCountries');
    if (uniqueElement) {
        uniqueElement.textContent = Object.keys(countryCounts).length;
    }
    
    // Update last update time
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    
    // Update top countries
    updateTopCountries(countryCounts);
    
    // Update recent registrations
    updateRecentRegistrations(registrations);
    
    // Update map display
    updateMapDisplay();
}

// Update top countries list
function updateTopCountries(countryCounts) {
    const topCountriesElement = document.getElementById('topCountries');
    if (!topCountriesElement) return;
    
    // Sort countries by count
    const sortedCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    topCountriesElement.innerHTML = '';
    
    if (sortedCountries.length === 0) {
        topCountriesElement.innerHTML = '<div class="loading">No registrations yet</div>';
        return;
    }
    
    sortedCountries.forEach(([country, count], index) => {
        const item = document.createElement('div');
        item.className = 'country-item-list';
        
        const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] + ' ' : '';
        
        item.innerHTML = `
            <div>
                <span class="country-name">${medal}${country}</span>
            </div>
            <span class="country-count">${count}</span>
        `;
        
        topCountriesElement.appendChild(item);
    });
}

// Update recent registrations
function updateRecentRegistrations(registrations) {
    const recentElement = document.getElementById('recentRegistrations');
    if (!recentElement) return;
    
    // Get last 5 registrations
    const recent = registrations
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    
    recentElement.innerHTML = '';
    
    if (recent.length === 0) {
        recentElement.innerHTML = '<div class="loading">No recent registrations</div>';
        return;
    }
    
    recent.forEach(reg => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        
        const time = new Date(reg.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        item.innerHTML = `
            <div>
                <strong>${reg.name}</strong><br>
                <small>${time}</small>
            </div>
            <span class="country-count">${reg.country}</span>
        `;
        
        recentElement.appendChild(item);
    });
}

// Update map display
function updateMapDisplay() {
    const mapElement = document.getElementById('simpleMap');
    if (!mapElement) return;
    
    const countryCounts = getCountryCounts();
    const maxCount = Math.max(...Object.values(countryCounts), 1);
    
    const gridElement = mapElement.querySelector('.map-grid');
    if (!gridElement) {
        mapElement.innerHTML = '<div class="map-grid"></div>';
    }
    
    const grid = mapElement.querySelector('.map-grid');
    grid.innerHTML = '';
    
    // Sort countries by count (descending)
    const sortedCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1]);
    
    if (sortedCountries.length === 0) {
        grid.innerHTML = '<div class="loading" style="grid-column: 1/-1;">No country data yet. Scan QR code to register!</div>';
        return;
    }
    
    // Create country items
    sortedCountries.forEach(([country, count]) => {
        const intensity = count / maxCount;
        const item = document.createElement('div');
        item.className = 'country-item';
        item.style.background = getColorForIntensity(intensity);
        item.innerHTML = `
            <div>${country}</div>
            <div class="country-count">${count}</div>
        `;
        
        // Add click event to show details
        item.addEventListener('click', () => {
            alert(`${country}: ${count} participant${count !== 1 ? 's' : ''}`);
        });
        
        grid.appendChild(item);
    });
}

// Get color based on intensity
function getColorForIntensity(intensity) {
    // Green gradient: light green (0) to dark green (1)
    const r = Math.floor(232 - (232 - 27) * intensity);
    const g = Math.floor(245 - (245 - 94) * intensity);
    const b = Math.floor(233 - (233 - 32) * intensity);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Register a new country
function registerCountry(country, name = "Anonymous", message = "") {
    initializeData();
    
    const registration = {
        country: country,
        name: name,
        message: message,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    const data = JSON.parse(localStorage.getItem('africaMapData'));
    data.registrations.push(registration);
    localStorage.setItem('africaMapData', JSON.stringify(data));
    
    // Update all displays
    updateStats();
    
    return registration;
}

// Initialize the application
function initializeApp() {
    initializeData();
    updateStats();
    
    // Set up auto-refresh for main display
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', updateStats);
    }
    
    // Auto-refresh every 10 seconds
    setInterval(updateStats, 10000);
}

// Run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
