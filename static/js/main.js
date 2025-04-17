/**
 * XSSploit - Main JavaScript
 * Handles UI interactions, navigation, and common functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Check if all labs have been completed
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
    
    // Add to leaderboard
    function addToLeaderboard(username, totalTime) {
        // Get current leaderboard
        let leaderboard = JSON.parse(localStorage.getItem('xssploit_leaderboard') || '[]');
        
        // Check if user already exists in leaderboard
        const existingEntry = leaderboard.find(entry => entry.username === username);
        
        if (existingEntry) {
            // Update if new time is better
            if (totalTime < existingEntry.totalTime) {
                existingEntry.totalTime = totalTime;
                existingEntry.date = new Date().toISOString();
            }
        } else {
            // Add new entry
            leaderboard.push({
                username: username,
                totalTime: totalTime,
                date: new Date().toISOString()
            });
        }
        
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
    
    // Format time in milliseconds to HH:MM:SS
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
    
    // Show name modal
    function showNameModal() {
        const modal = document.getElementById('username-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    // Close name modal
    function closeNameModal() {
        const modal = document.getElementById('username-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Check if user has entered name
    const hasUsername = localStorage.getItem('xssploit_username');
    if (!hasUsername && document.getElementById('username-modal')) {
        showNameModal();
        
        // Set up submit handler
        document.getElementById('username-submit').addEventListener('click', function() {
            const username = document.getElementById('username-input').value.trim();
            
            if (username) {
                localStorage.setItem('xssploit_username', username);
                closeNameModal();
            }
        });
    }
    
    // Check for lab completion on page load
    checkAllLabsCompletion();
});