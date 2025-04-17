/**
 * XSSploit - Leaderboard Management
 * Handles leaderboard display, sorting, and updates
 */

const leaderboardManager = (function() {
    // Badge levels based on total completion time
    const BADGE_LEVELS = [
        { name: 'Grand Master', maxTime: 15 * 60 * 1000 },  // Under 15 minutes
        { name: 'Master', maxTime: 30 * 60 * 1000 },        // Under 30 minutes
        { name: 'Expert', maxTime: 60 * 60 * 1000 },        // Under 1 hour
        { name: 'Advanced', maxTime: 2 * 60 * 60 * 1000 },  // Under 2 hours
        { name: 'Intermediate', maxTime: 3 * 60 * 60 * 1000 }, // Under 3 hours
        { name: 'Novice', maxTime: Infinity }               // Any time
    ];
    
    /**
     * Refreshes the leaderboard display
     */
    function refreshLeaderboard() {
        const leaderboardEntries = document.getElementById('leaderboard-entries');
        if (!leaderboardEntries) return;
        
        // Get leaderboard data
        const leaderboard = sessionManager.getLeaderboard();
        
        // Clear current entries
        leaderboardEntries.innerHTML = '';
        
        // Show empty state if no entries
        if (leaderboard.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>No entries yet. Be the first to complete all labs!</p>';
            leaderboardEntries.appendChild(emptyState);
            return;
        }
        
        // Add entries (limit to top 10)
        const displayLimit = Math.min(leaderboard.length, 10);
        
        for (let i = 0; i < displayLimit; i++) {
            const entry = leaderboard[i];
            const badgeName = getBadgeForTime(entry.time);
            
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            entryElement.innerHTML = `
                <div class="rank">${i + 1}</div>
                <div class="name">${escape(entry.username)}</div>
                <div class="time">${sessionManager.formatTime(entry.time)}</div>
                <div class="badge">${badgeName}</div>
            `;
            
            // Add animation for new entries
            entryElement.style.animation = 'fadeIn 0.5s';
            
            leaderboardEntries.appendChild(entryElement);
        }
        
        console.log('Leaderboard refreshed');
    }
    
    /**
     * Sorts the leaderboard by the specified criteria
     * @param {string} sortBy - Criteria to sort by ('time' or 'name')
     */
    function sortLeaderboard(sortBy) {
        const leaderboard = sessionManager.getLeaderboard();
        
        if (sortBy === 'time') {
            // Already sorted by time in sessionManager
            refreshLeaderboard();
        } else if (sortBy === 'name') {
            // Sort by name
            leaderboard.sort((a, b) => a.username.localeCompare(b.username));
            
            // Update leaderboard display
            const leaderboardEntries = document.getElementById('leaderboard-entries');
            if (!leaderboardEntries) return;
            
            // Clear current entries
            leaderboardEntries.innerHTML = '';
            
            // Show empty state if no entries
            if (leaderboard.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = '<p>No entries yet. Be the first to complete all labs!</p>';
                leaderboardEntries.appendChild(emptyState);
                return;
            }
            
            // Add entries (limit to top 10)
            const displayLimit = Math.min(leaderboard.length, 10);
            
            for (let i = 0; i < displayLimit; i++) {
                const entry = leaderboard[i];
                const badgeName = getBadgeForTime(entry.time);
                
                const entryElement = document.createElement('div');
                entryElement.className = 'leaderboard-entry';
                entryElement.innerHTML = `
                    <div class="rank">#</div>
                    <div class="name">${escape(entry.username)}</div>
                    <div class="time">${sessionManager.formatTime(entry.time)}</div>
                    <div class="badge">${badgeName}</div>
                `;
                
                leaderboardEntries.appendChild(entryElement);
            }
        }
    }
    
    /**
     * Determines the badge level based on completion time
     * @param {number} time - Total completion time in milliseconds
     * @returns {string} - Badge name
     */
    function getBadgeForTime(time) {
        for (const level of BADGE_LEVELS) {
            if (time <= level.maxTime) {
                return level.name;
            }
        }
        return 'Novice'; // Default badge
    }
    
    /**
     * Escapes HTML special characters to prevent XSS
     * @param {string} unsafe - Potentially unsafe string
     * @returns {string} - Escaped string
     */
    function escape(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Initialize leaderboard on page load
    document.addEventListener('DOMContentLoaded', function() {
        refreshLeaderboard();
        
        // Set up automatic refresh every 10 seconds
        setInterval(refreshLeaderboard, 10000);
    });
    
    // Public API
    return {
        refreshLeaderboard,
        sortLeaderboard
    };
})();
