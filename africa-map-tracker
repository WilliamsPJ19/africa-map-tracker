// Africa Map Data - SVG paths for African countries
const africaCountries = {
    "Nigeria": { path: "M400,350 L420,360 L430,350 L440,340 L450,330 L460,320 L470,310 L480,300", color: "#e0e0e0" },
    "Ghana": { path: "M380,340 L390,335 L400,330 L410,325 L420,320", color: "#e0e0e0" },
    "South Africa": { path: "M420,500 L430,490 L440,480 L450,470 L460,460", color: "#e0e0e0" },
    "Kenya": { path: "M450,380 L460,370 L470,360 L480,350", color: "#e0e0e0" },
    "Ethiopia": { path: "M440,360 L450,350 L460,340 L470,330", color: "#e0e0e0" },
    "Egypt": { path: "M420,300 L430,290 L440,280 L450,270", color: "#e0e0e0" },
    // Add all African countries with their SVG paths
};

// Sample data for testing
const sampleData = {
    registrations: [
        { country: "Nigeria", name: "John", timestamp: "2024-01-15T10:30:00Z" },
        { country: "Ghana", name: "Sarah", timestamp: "2024-01-15T10:35:00Z" },
        { country: "Nigeria", name: "Mike", timestamp: "2024-01-15T10:40:00Z" },
        { country: "South Africa", name: "David", timestamp: "2024-01-15T10:45:00Z" },
        { country: "Kenya", name: "Lisa", timestamp: "2024-01-15T10:50:00Z" },
        { country: "Nigeria", name: "Emma", timestamp: "2024-01-15T10:55:00Z" },
        { country: "Ghana", name: "James", timestamp: "2024-01-15T11:00:00Z" },
    ]
};

// Initialize data storage
function initializeData() {
    if (!localStorage.getItem('africaMapData')) {
        localStorage.setItem('africaMapData', JSON.stringify(sampleData));
    }
}

// Get registration data
function getRegistrations() {
    const data = JSON.parse(localStorage.getItem('africaMapData') || '{"registrations":[]}');
    return data.registrations;
}

// Add new registration
function addRegistration(country, name = "Anonymous", message = "") {
    const registration = {
        country,
        name,
        message,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    const data = JSON.parse(localStorage.getItem('africaMapData') || '{"registrations":[]}');
    data.registrations.push(registration);
    localStorage.setItem('africaMapData', JSON.stringify(data));
    
    return registration;
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

// Draw Africa map with gradients
function drawAfricaMap() {
    const svg = document.getElementById('africaMap');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const countryCounts = getCountryCounts();
    const maxCount = Math.max(...Object.values(countryCounts), 1);
    
    // Add each country path
    Object.entries(africaCountries).forEach(([country, data]) => {
        const count = countryCounts[country] || 0;
        const intensity = count / maxCount;
        
        // Calculate color based on intensity
        const color = getColorForIntensity(intensity);
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", data.path);
        path.setAttribute("fill", color);
        path.setAttribute("stroke", "#ffffff");
        path.setAttribute("stroke-width", "1");
        path.setAttribute("class", "country-path");
        path.setAttribute("data-country", country);
        path.setAttribute("data-count", count);
        
        // Add hover effect
        path.addEventListener('mouseenter', function() {
            showCountryTooltip(country, count);
        });
        
        path.addEventListener('mouseleave', function() {
            hideCountryTooltip();
        });
        
        svg.appendChild(path);
    });
    
    // Add country labels
    Object.entries(africaCountries).forEach(([country, data]) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const count = countryCounts[country] || 0;
        
        // Simple positioning - in a real app, you'd use proper coordinates
        const x = 400;
        const y = Object.keys(africaCountries).indexOf(country) * 20 + 50;
        
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("font-size", "10");
        text.setAttribute("fill", "#333");
        text.textContent = `${country}: ${count}`;
        
        svg.appendChild(text);
    });
}

// Helper function to get color based on intensity
function getColorForIntensity(intensity) {
    // Green gradient: light green (0) to dark green (1)
    const r = Math.floor(232 - (232 - 27) * intensity);
    const g = Math.floor(245 - (245 - 94) * intensity);
    const b = Math.floor(233 - (233 - 32) * intensity);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Show country tooltip
function showCountryTooltip(country, count) {
    // Create or update tooltip
    let tooltip = document.getElementById('countryTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'countryTooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <strong>${country}</strong><br>
        Participants: ${count}
    `;
    
    // Position tooltip near mouse
    document.addEventListener('mousemove', function(e) {
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY + 10) + 'px';
    });
}

// Hide country tooltip
function hideCountryTooltip() {
    const tooltip = document.getElementById('countryTooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Update statistics
function updateStats() {
    const registrations = getRegistrations();
    const countryCounts = getCountryCounts();
    
    // Update total participants
    document.getElementById('totalParticipants').textContent = registrations.length;
    
    // Update unique countries
    document.getElementById('uniqueCountries').textContent = Object.keys(countryCounts).length;
    
    // Update top countries list
    updateTopCountries(countryCounts);
    
    // Update recent registrations
    updateRecentRegistrations(registrations);
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
    
    sortedCountries.forEach(([country, count], index) => {
        const item = document.createElement('div');
        item.className = 'country-item';
        
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

// Update last update time
function updateLastUpdateTime() {
    const element = document.getElementById('lastUpdate');
    if (element) {
        const now = new Date();
        element.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
}

// Load map data
function loadMapData() {
    initializeData();
    drawAfricaMap();
    updateStats();
}

// Initialize everything when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMapData);
} else {
    loadMapData();
}
