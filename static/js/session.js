/**
 * XSSploit - Session Management
 * Handles user sessions, progress tracking, and time management
 */

const sessionManager = (function() {
    // Session configuration
    const SESSION_KEY = 'xssploit_session';
    const LEADERBOARD_KEY = 'xssploit_leaderboard';
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // Session structure
    // {
    //   username: string,
    //   startTime: number (timestamp),
    //   lastActive: number (timestamp),
    //   labStatus: { labId: { completed: boolean, time: number (ms) } },
    //   inLabMode: boolean
    // }
    
    /**
     * Creates a new session with the given username
     * @param {string} username - User's name or identifier
     */
    function createSession(username) {
        const session = {
            username: username,
            startTime: Date.now(),
            lastActive: Date.now(),
            labStatus: {},
            inLabMode: true
        };
        
        // Save session to localStorage
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        console.log(`Session created for ${username}`);
        return session;
    }
    
    /**
     * Retrieves the current session
     * @returns {Object|null} - The session object or null if no session exists
     */
    function getSession() {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (!sessionData) return null;
        
        try {
            const session = JSON.parse(sessionData);
            
            // Check for session timeout
            if (Date.now() - session.lastActive > SESSION_TIMEOUT) {
                console.log('Session expired due to inactivity');
                clearSession();
                return null;
            }
            
            // Update last active time
            session.lastActive = Date.now();
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            
            return session;
        } catch (e) {
            console.error('Error parsing session data:', e);
            return null;
        }
    }
    
    /**
     * Checks if there is an active session
     * @returns {boolean} - True if a valid session exists
     */
    function hasActiveSession() {
        return getSession() !== null;
    }
    
    /**
     * Updates the status of a lab in the session
     * @param {string} labId - The ID of the lab
     * @param {boolean} completed - Whether the lab was completed
     * @param {number} time - Time taken to complete the lab in milliseconds
     */
    function updateLabStatus(labId, completed, time) {
        const session = getSession();
        if (!session) return;
        
        // Create or update lab status
        session.labStatus[labId] = {
            completed: completed,
            time: time
        };
        
        // Save updated session
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        // Check if all labs are completed
        checkAllLabsCompletion();
        
        console.log(`Lab ${labId} status updated: completed=${completed}, time=${time}ms`);
    }
    
    /**
     * Gets the status of a specific lab
     * @param {string} labId - The ID of the lab
     * @returns {Object|null} - The lab status or null if not found
     */
    function getLabStatus(labId) {
        const session = getSession();
        if (!session || !session.labStatus || !session.labStatus[labId]) return null;
        
        return session.labStatus[labId];
    }
    
    /**
     * Checks if all labs have been completed and updates the leaderboard if necessary
     */
    function checkAllLabsCompletion() {
        const session = getSession();
        if (!session) return;
        
        // Count completed labs and calculate total time
        let completedCount = 0;
        let totalTime = 0;
        
        // There should be 50 labs total
        const ALL_LABS_COUNT = 50;
        
        for (const labId in session.labStatus) {
            if (session.labStatus[labId].completed) {
                completedCount++;
                totalTime += session.labStatus[labId].time;
            }
        }
        
        // Update UI elements if they exist
        const completedCountElement = document.getElementById('completed-count');
        const totalTimeElement = document.getElementById('total-time');
        const progressFillElement = document.getElementById('progress-fill');
        
        if (completedCountElement) {
            completedCountElement.textContent = completedCount;
        }
        
        if (totalTimeElement) {
            totalTimeElement.textContent = formatTime(totalTime);
        }
        
        if (progressFillElement) {
            const progressPercentage = (completedCount / ALL_LABS_COUNT) * 100;
            progressFillElement.style.width = `${progressPercentage}%`;
        }
        
        // If all labs are completed, add to leaderboard
        if (completedCount === ALL_LABS_COUNT) {
            console.log('All labs completed! Adding to leaderboard...');
            addToLeaderboard(session.username, totalTime);
        }
    }
    
    /**
     * Adds a user to the leaderboard
     * @param {string} username - The user's name
     * @param {number} totalTime - Total time taken to complete all labs
     */
    function addToLeaderboard(username, totalTime) {
        // Get current leaderboard
        let leaderboard = getLeaderboard();
        
        // Check if user is already on leaderboard
        const existingEntryIndex = leaderboard.findIndex(entry => entry.username === username);
        
        if (existingEntryIndex !== -1) {
            // Update existing entry if new time is better
            if (totalTime < leaderboard[existingEntryIndex].time) {
                leaderboard[existingEntryIndex].time = totalTime;
            }
        } else {
            // Add new entry
            leaderboard.push({
                username: username,
                time: totalTime,
                date: Date.now()
            });
        }
        
        // Sort by time (ascending)
        leaderboard.sort((a, b) => a.time - b.time);
        
        // Limit to 100 entries
        if (leaderboard.length > 100) {
            leaderboard = leaderboard.slice(0, 100);
        }
        
        // Save leaderboard
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
        
        // Refresh leaderboard display if available
        if (typeof leaderboardManager !== 'undefined') {
            leaderboardManager.refreshLeaderboard();
        }
    }
    
    /**
     * Gets the current leaderboard
     * @returns {Array} - Array of leaderboard entries
     */
    function getLeaderboard() {
        const leaderboardData = localStorage.getItem(LEADERBOARD_KEY);
        if (!leaderboardData) return [];
        
        try {
            return JSON.parse(leaderboardData);
        } catch (e) {
            console.error('Error parsing leaderboard data:', e);
            return [];
        }
    }
    
    /**
     * Clears the current session
     */
    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
        console.log('Session cleared');
    }
    
    /**
     * Sets whether the user is in lab mode
     * @param {boolean} inLabMode - Whether the user is in lab mode
     */
    function setInLabMode(inLabMode) {
        const session = getSession();
        if (!session) return;
        
        session.inLabMode = inLabMode;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    
    /**
     * Gets whether the user is in lab mode
     * @returns {boolean} - Whether the user is in lab mode
     */
    function getInLabMode() {
        const session = getSession();
        return session ? session.inLabMode : false;
    }
    
    /**
     * Exports the current session as a JSON string for the user to save
     */
    function exportSession() {
        const session = getSession();
        if (!session) {
            alert('No active session to export');
            return;
        }
        
        // Create a data URL for the session JSON
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session));
        
        // Create a temporary link and trigger download
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `xssploit_session_${session.username}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        alert('Session exported successfully. You can use this file to restore your progress later.');
    }
    
    /**
     * Imports a session from a JSON file
     */
    function importSession() {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const session = JSON.parse(event.target.result);
                    
                    // Validate session structure
                    if (!session.username || !session.startTime || !session.labStatus) {
                        throw new Error('Invalid session file format');
                    }
                    
                    // Save imported session
                    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                    
                    alert('Session imported successfully. The page will now reload to apply changes.');
                    window.location.reload();
                } catch (error) {
                    console.error('Error importing session:', error);
                    alert('Error importing session: ' + error.message);
                }
            };
            
            reader.readAsText(file);
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        fileInput.remove();
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
    
    // Public API
    return {
        createSession,
        getSession,
        hasActiveSession,
        updateLabStatus,
        getLabStatus,
        clearSession,
        setInLabMode,
        getInLabMode,
        exportSession,
        importSession,
        getLeaderboard,
        checkAllLabsCompletion,
        formatTime
    };
})();
