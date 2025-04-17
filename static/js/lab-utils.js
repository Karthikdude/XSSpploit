/**
 * XSSploit - Lab Utilities
 * Common functionality used across lab environments
 */

(function() {
    /**
     * Checks if all labs have been completed and updates the UI
     */
    function checkAllLabsCompletion() {
        // Get progress data from localStorage
        const progress = JSON.parse(localStorage.getItem('xssploit_progress') || '{}');
        
        // Count completed labs
        let completedCount = 0;
        let totalTime = 0;
        
        for (let i = 1; i <= 50; i++) {
            const labId = i.toString();
            const labProgress = progress[labId];
            
            if (labProgress && labProgress.completed) {
                completedCount++;
                totalTime += labProgress.time;
            }
        }
        
        // Update progress display if it exists
        const progressDisplay = document.getElementById('progress-display');
        if (progressDisplay) {
            progressDisplay.textContent = `${completedCount}/50 labs completed`;
        }
        
        // If all labs are completed, show completion message
        if (completedCount === 50) {
            // Get user info
            const username = localStorage.getItem('xssploit_username') || 'Anonymous';
            
            // Add to leaderboard
            addToLeaderboard(username, totalTime);
        }
    }
    
    /**
     * Adds a user to the leaderboard
     * @param {string} username - The user's name
     * @param {number} totalTime - Total time taken to complete all labs
     */
    function addToLeaderboard(username, totalTime) {
        // Get current leaderboard
        let leaderboard = JSON.parse(localStorage.getItem('xssploit_leaderboard') || '[]');
        
        // Add new entry
        leaderboard.push({
            username: username,
            totalTime: totalTime,
            date: new Date().toISOString()
        });
        
        // Sort by total time (ascending)
        leaderboard.sort((a, b) => a.totalTime - b.totalTime);
        
        // Save back to localStorage
        localStorage.setItem('xssploit_leaderboard', JSON.stringify(leaderboard));
        
        // Send to server
        fetch('/api/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                totalTime: totalTime
            })
        }).catch(err => {
            console.error('Error updating leaderboard:', err);
        });
    }
    
    /**
     * Gets the current leaderboard
     * @returns {Array} - Array of leaderboard entries
     */
    function getLeaderboard() {
        return JSON.parse(localStorage.getItem('xssploit_leaderboard') || '[]');
    }
    
    /**
     * Formats time in milliseconds to a human-readable string (HH:MM:SS)
     * @param {number} ms - Time in milliseconds
     * @returns {string} - Formatted time string
     */
    function formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }
    
    // Export functions to global scope
    window.LabUtils = {
        checkAllLabsCompletion,
        addToLeaderboard,
        getLeaderboard,
        formatTime
    };
    
    // Check lab completion on page load
    document.addEventListener('DOMContentLoaded', checkAllLabsCompletion);
})();