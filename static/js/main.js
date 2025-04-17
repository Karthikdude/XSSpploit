/**
 * XSSploit - Main JavaScript
 * Handles UI interactions, navigation, and common functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and X
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && !event.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        const icon = menuToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // "Start Labs" button in hero section
    const startLabsBtn = document.getElementById('start-labs-btn');
    const aboutStartBtn = document.getElementById('about-start-btn');
    const nameModal = document.getElementById('name-modal');
    const closeModalBtn = nameModal?.querySelector('.close');
    const nameForm = document.getElementById('name-form');
    const anonymousBtn = document.getElementById('anonymous-btn');
    
    // Function to show the name modal
    function showNameModal() {
        if (nameModal) {
            nameModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    // Function to close the name modal
    function closeNameModal() {
        if (nameModal) {
            nameModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    // Event listeners for starting labs
    if (startLabsBtn) {
        startLabsBtn.addEventListener('click', function() {
            // Check if user already has an active session
            if (sessionManager.hasActiveSession()) {
                showLabDashboard();
            } else {
                showNameModal();
            }
        });
    }
    
    if (aboutStartBtn) {
        aboutStartBtn.addEventListener('click', function() {
            if (sessionManager.hasActiveSession()) {
                showLabDashboard();
            } else {
                showNameModal();
            }
        });
    }
    
    // Close modal with X button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeNameModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === nameModal) {
            closeNameModal();
        }
    });
    
    // Form submission
    if (nameForm) {
        nameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            if (username) {
                sessionManager.createSession(username);
                closeNameModal();
                showLabDashboard();
            }
        });
    }
    
    // Anonymous button
    if (anonymousBtn) {
        anonymousBtn.addEventListener('click', function() {
            const anonymousName = 'Anonymous_' + Math.floor(Math.random() * 10000);
            sessionManager.createSession(anonymousName);
            closeNameModal();
            showLabDashboard();
        });
    }
    
    // Success modal controls
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = successModal?.querySelector('.close');
    const nextLabBtn = document.getElementById('next-lab-btn');
    const backToListBtn = document.getElementById('back-to-list-btn');
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    if (nextLabBtn) {
        nextLabBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
            labManager.loadNextLab();
        });
    }
    
    if (backToListBtn) {
        backToListBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    // Function to show lab dashboard
    function showLabDashboard() {
        const labsDashboard = document.getElementById('lab-dashboard');
        const heroSection = document.getElementById('hero');
        const labsSection = document.getElementById('labs');
        
        if (labsDashboard && heroSection && labsSection) {
            heroSection.style.display = 'none';
            labsSection.style.display = 'none';
            labsDashboard.style.display = 'block';
            
            // Initialize the lab dashboard
            updateUserDisplay();
            labManager.initializeLabList();
        }
    }
    
    // Update user display in dashboard
    function updateUserDisplay() {
        const userDisplayName = document.getElementById('user-display-name');
        if (userDisplayName) {
            const session = sessionManager.getSession();
            if (session && session.username) {
                userDisplayName.textContent = session.username;
            }
        }
    }
    
    // Tab switching in lab dashboard
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter labs by category
            const category = this.getAttribute('data-category');
            labManager.filterLabsByCategory(category);
        });
    });
    
    // Session management buttons
    const saveSessionBtn = document.getElementById('save-session-btn');
    const loadSessionBtn = document.getElementById('load-session-btn');
    const clearSessionBtn = document.getElementById('clear-session-btn');
    
    if (saveSessionBtn) {
        saveSessionBtn.addEventListener('click', function() {
            sessionManager.exportSession();
        });
    }
    
    if (loadSessionBtn) {
        loadSessionBtn.addEventListener('click', function() {
            sessionManager.importSession();
        });
    }
    
    if (clearSessionBtn) {
        clearSessionBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to forget this session? All progress will be lost.')) {
                sessionManager.clearSession();
                window.location.reload();
            }
        });
    }
    
    // Hint toggle
    const hintToggle = document.getElementById('hint-toggle');
    const hintContent = document.getElementById('hint-content');
    
    if (hintToggle && hintContent) {
        hintToggle.addEventListener('click', function() {
            if (hintContent.style.display === 'none') {
                hintContent.style.display = 'block';
                hintToggle.textContent = 'Hide Hint';
            } else {
                hintContent.style.display = 'none';
                hintToggle.textContent = 'Show Hint';
            }
        });
    }
    
    // Leaderboard controls
    const sortButtons = document.querySelectorAll('.sort-btn');
    const refreshLeaderboardBtn = document.getElementById('refresh-leaderboard');
    
    if (sortButtons) {
        sortButtons.forEach(button => {
            button.addEventListener('click', function() {
                sortButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const sortBy = this.getAttribute('data-sort');
                leaderboardManager.sortLeaderboard(sortBy);
            });
        });
    }
    
    if (refreshLeaderboardBtn) {
        refreshLeaderboardBtn.addEventListener('click', function() {
            leaderboardManager.refreshLeaderboard();
        });
    }
    
    // Check if user should be shown the lab dashboard on page load
    if (sessionManager && sessionManager.hasActiveSession()) {
        // Check if we're on a page that has the lab dashboard
        const labDashboard = document.getElementById('lab-dashboard');
        if (labDashboard) {
            // If we were previously in lab mode, restore it
            if (sessionManager.getInLabMode()) {
                showLabDashboard();
            }
        }
    }
});
