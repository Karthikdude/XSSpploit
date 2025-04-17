/**
 * XSSploit - Lab Utilities
 * Common functions for lab interactions and success detection
 */

// Listen for XSS payloads in alerts
(function() {
    // Keep a reference to the original alert function
    const originalAlert = window.alert;
    
    // Override the alert function to detect successful payloads
    window.alert = function(message) {
        // Check if the message is "Xpwned" (the target payload)
        if (message === "Xpwned") {
            // Notify the parent window about the successful exploit
            window.parent.postMessage({ type: 'LAB_COMPLETED' }, '*');
        }
        
        // Call the original alert function
        originalAlert.call(window, message);
    };
    
    // Helper function to safely parse URL parameters
    window.getUrlParameter = function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    };
    
    // Helper function to escape HTML to display it safely
    window.escapeHtml = function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    
    // Helper function to format time in milliseconds to HH:MM:SS
    window.formatTime = function(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    };
})();