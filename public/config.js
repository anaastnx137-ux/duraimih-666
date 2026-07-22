// Dr. Saud bin Fahd Al-Duraymih Law Office - Unified Configuration
const CONFIG = {
    // Google Apps Script Web App Deployment URL
    // Replace with your actual deployed script URL from Extensions -> Apps Script -> Deploy
    API_ENDPOINT: "/api",

    // Timeout for network requests in milliseconds (10 seconds)
    REQUEST_TIMEOUT: 10000,

    // Rate limit configuration (cooldown in milliseconds before the next submission is allowed)
    RATE_LIMIT_COOLDOWN: 60000 // 1 minute
};

// Bind to window for universal browser script access
window.CONFIG = CONFIG;
