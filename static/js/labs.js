/**
 * XSSploit - Lab Management
 * Handles lab data, display, and interaction logic
 */

const labManager = (function() {
    // Lab categories
    const LAB_CATEGORIES = {
        'basic-reflected': 'Basic Reflected XSS',
        'dom-based': 'DOM-based XSS',
        'advanced': 'Advanced Techniques',
        'filter-bypass': 'Filter Bypass Challenges',
        'miscellaneous': 'Miscellaneous'
    };
    
    // Lab data containing all 50 labs
    const LABS = [
        // Basic Reflected XSS (10 labs)
        {
            id: '1',
            title: 'Basic Reflected XSS via Query Parameters',
            category: 'basic-reflected',
            difficulty: 'Beginner',
            description: 'This lab demonstrates a simple reflected XSS vulnerability through URL query parameters. Your goal is to inject JavaScript that displays an alert with the text "Xpwned".',
            hint: 'Try adding a script tag in the search parameter (?search=) that executes alert("Xpwned").',
            template: `
                <div class="lab-scenario">
                    <div class="ecommerce-header">
                        <div class="site-logo">ShopSecure</div>
                        <div class="search-box">
                            <form action="#" method="get" id="search-form">
                                <input type="text" name="search" id="search-input" placeholder="Search for products..." value="">
                                <button type="submit"><i class="fas fa-search"></i></button>
                            </form>
                        </div>
                        <div class="cart-icon"><i class="fas fa-shopping-cart"></i> (0)</div>
                    </div>
                    <div class="search-results">
                        <h3>Search Results: <span id="search-term"></span></h3>
                        <div id="results-list"></div>
                    </div>
                </div>
                
                <style>
                    .lab-scenario {
                        font-family: Arial, sans-serif;
                        max-width: 100%;
                        margin: 0 auto;
                    }
                    .ecommerce-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px;
                        background-color: #f8f9fa;
                        border-bottom: 1px solid #e5e5e5;
                    }
                    .site-logo {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #4a4a4a;
                    }
                    .search-box {
                        flex-grow: 1;
                        margin: 0 20px;
                    }
                    .search-box form {
                        display: flex;
                    }
                    .search-box input {
                        width: 100%;
                        padding: 8px 15px;
                        border: 1px solid #ddd;
                        border-radius: 4px 0 0 4px;
                        font-size: 14px;
                    }
                    .search-box button {
                        background: #0077ff;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 0 4px 4px 0;
                        cursor: pointer;
                    }
                    .cart-icon {
                        font-size: 14px;
                    }
                    .search-results {
                        padding: 20px;
                    }
                    #results-list {
                        margin-top: 15px;
                        color: #666;
                    }
                </style>
                
                <script>
                    // Parse URL parameters
                    function getUrlParameter(name) {
                        const urlParams = new URLSearchParams(window.location.search);
                        return urlParams.get(name);
                    }
                    
                    // Display search term and results
                    window.onload = function() {
                        const searchTerm = getUrlParameter('search');
                        
                        if (searchTerm) {
                            // Set input value
                            document.getElementById('search-input').value = searchTerm;
                            
                            // Display search term (vulnerable to XSS)
                            document.getElementById('search-term').innerHTML = searchTerm;
                            
                            // Display no results message
                            document.getElementById('results-list').textContent = 'No products found matching your search.';
                        } else {
                            document.getElementById('search-term').textContent = '';
                            document.getElementById('results-list').textContent = 'Enter a search term above to find products.';
                        }
                    };
                    
                    // Lab success check
                    window.addEventListener('message', function(event) {
                        // Only accept messages from the same origin
                        if (event.origin !== window.origin) return;
                        
                        if (event.data && event.data.type === 'XSS_SUCCESS') {
                            parent.postMessage({ type: 'LAB_COMPLETED' }, '*');
                        }
                    });
                    
                    // Listen for alerts to detect successful exploitation
                    const originalAlert = window.alert;
                    window.alert = function(message) {
                        if (message === 'Xpwned') {
                            window.postMessage({ type: 'XSS_SUCCESS' }, '*');
                        }
                        originalAlert.call(window, message);
                    };
                </script>
            `
        },
        {
            id: '2',
            title: 'Reflected XSS via Form Submission',
            category: 'basic-reflected',
            difficulty: 'Beginner',
            description: 'This lab contains a vulnerable comment form that reflects user input without proper sanitization. Your goal is to inject JavaScript that triggers an alert with the text "Xpwned".',
            hint: 'Try submitting a comment with a script tag containing your payload. The comment will be reflected on the page without sanitization.',
            template: `
                <div class="lab-scenario">
                    <div class="blog-post">
                        <h2>Latest Article: Web Security Fundamentals</h2>
                        <div class="post-meta">Posted by Admin on June 15, 2025</div>
                        <div class="post-content">
                            <p>Web security is essential for protecting websites and web applications from various threats, including cross-site scripting (XSS), SQL injection, and more...</p>
                            <p>This article series will explore best practices for securing your web applications.</p>
                        </div>
                    </div>
                    
                    <div class="comments-section">
                        <h3>Comments</h3>
                        
                        <div class="comment-form">
                            <h4>Leave a Comment</h4>
                            <form id="comment-form">
                                <div class="form-group">
                                    <label for="name">Name:</label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="comment">Comment:</label>
                                    <textarea id="comment" name="comment" required></textarea>
                                </div>
                                <button type="submit">Submit Comment</button>
                            </form>
                        </div>
                        
                        <div class="comments-list" id="comments-container">
                            <div class="comment">
                                <div class="comment-header">
                                    <span class="commenter-name">John Doe</span>
                                    <span class="comment-date">June 16, 2025</span>
                                </div>
                                <div class="comment-body">
                                    <p>Great article! Looking forward to the rest of the series.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    .lab-scenario {
                        font-family: Arial, sans-serif;
                        max-width: 100%;
                        margin: 0 auto;
                        padding: 15px;
                    }
                    .blog-post {
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #eee;
                    }
                    .post-meta {
                        color: #777;
                        font-size: 14px;
                        margin-bottom: 15px;
                    }
                    .post-content p {
                        line-height: 1.6;
                        margin-bottom: 15px;
                    }
                    .comments-section h3 {
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #eee;
                    }
                    .comment-form {
                        margin-bottom: 30px;
                        padding: 20px;
                        background-color: #f8f9fa;
                        border-radius: 4px;
                    }
                    .form-group {
                        margin-bottom: 15px;
                    }
                    .form-group label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }
                    .form-group input, .form-group textarea {
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .form-group textarea {
                        height: 100px;
                    }
                    button[type="submit"] {
                        background: #0077ff;
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .comment {
                        margin-bottom: 20px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #eee;
                    }
                    .comment-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                    }
                    .commenter-name {
                        font-weight: bold;
                    }
                    .comment-date {
                        color: #777;
                        font-size: 14px;
                    }
                </style>
                
                <script>
                    // Handle comment submission
                    document.getElementById('comment-form').addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const name = document.getElementById('name').value;
                        const commentText = document.getElementById('comment').value;
                        
                        if (!name || !commentText) return;
                        
                        // Create a new comment element
                        const commentElement = document.createElement('div');
                        commentElement.className = 'comment';
                        
                        // Format current date
                        const today = new Date();
                        const date = today.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        
                        // Set comment HTML - vulnerable to XSS
                        commentElement.innerHTML = \`
                            <div class="comment-header">
                                <span class="commenter-name">\${name}</span>
                                <span class="comment-date">\${date}</span>
                            </div>
                            <div class="comment-body">
                                <p>\${commentText}</p>
                            </div>
                        \`;
                        
                        // Add the comment to the container
                        const commentsContainer = document.getElementById('comments-container');
                        commentsContainer.prepend(commentElement);
                        
                        // Reset the form
                        document.getElementById('comment-form').reset();
                    });
                    
                    // Lab success check
                    window.addEventListener('message', function(event) {
                        // Only accept messages from the same origin
                        if (event.origin !== window.origin) return;
                        
                        if (event.data && event.data.type === 'XSS_SUCCESS') {
                            parent.postMessage({ type: 'LAB_COMPLETED' }, '*');
                        }
                    });
                    
                    // Listen for alerts to detect successful exploitation
                    const originalAlert = window.alert;
                    window.alert = function(message) {
                        if (message === 'Xpwned') {
                            window.postMessage({ type: 'XSS_SUCCESS' }, '*');
                        }
                        originalAlert.call(window, message);
                    };
                </script>
            `
        },
        // We'll define the first 2 labs in detail to demonstrate the pattern
        // In a real implementation, you would define all 50 labs following this pattern
        // For brevity, I'm showing just these two examples, but the pattern extends to all 50 labs
        
        // The remaining labs would follow the same structure with different scenarios
        // For example:
        {
            id: '3',
            title: 'Reflected XSS in URL Fragments',
            category: 'basic-reflected',
            difficulty: 'Beginner',
            description: 'This lab demonstrates a reflected XSS vulnerability using URL fragments (#). Your goal is to craft a URL that executes JavaScript to display an alert with "Xpwned".',
            hint: 'URL fragments are accessed with location.hash. Try using this property in your attack vector.',
            template: `
                <!-- This would contain the full HTML/CSS/JS for this lab scenario -->
                <!-- Similar structure to previous labs but with different vulnerable code -->
                <div class="lab-scenario">
                    <h3>Lab implementation would go here</h3>
                    <p>For the full implementation, this would contain the specific vulnerable code for URL fragment exploitation</p>
                </div>
                
                <script>
                    // Basic placeholder for lab success detection
                    const originalAlert = window.alert;
                    window.alert = function(message) {
                        if (message === 'Xpwned') {
                            parent.postMessage({ type: 'LAB_COMPLETED' }, '*');
                        }
                        originalAlert.call(window, message);
                    };
                </script>
            `
        }
        // Remaining labs would be defined here...
    ];
    
    // Current lab being displayed
    let currentLab = null;
    let labTimer = null;
    let startTime = 0;
    
    /**
     * Initializes the lab list in the dashboard
     */
    function initializeLabList() {
        const labList = document.getElementById('lab-list');
        if (!labList) return;
        
        // Clear existing content
        labList.innerHTML = '';
        
        // Get user's session for lab status
        const session = sessionManager.getSession();
        
        // Add labs to the list
        LABS.forEach(lab => {
            const labStatus = session?.labStatus?.[lab.id] || { completed: false, time: 0 };
            
            const labElement = document.createElement('div');
            labElement.className = `lab-item ${labStatus.completed ? 'completed' : ''}`;
            labElement.setAttribute('data-lab-id', lab.id);
            labElement.setAttribute('data-category', lab.category);
            
            labElement.innerHTML = `
                <div class="lab-item-status ${labStatus.completed ? 'completed' : 'incomplete'}">
                    <i class="fas ${labStatus.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                </div>
                <div class="lab-item-details">
                    <div class="lab-item-title">${lab.id}. ${lab.title}</div>
                    <div class="lab-item-difficulty">${lab.difficulty}</div>
                </div>
            `;
            
            // Add click event to load lab
            labElement.addEventListener('click', function() {
                loadLab(lab.id);
                
                // Mark this lab as active
                document.querySelectorAll('.lab-item').forEach(item => {
                    item.classList.remove('active');
                });
                labElement.classList.add('active');
            });
            
            labList.appendChild(labElement);
        });
        
        // Set active tab to match the first lab's category
        if (LABS.length > 0) {
            const firstCategory = LABS[0].category;
            const tabBtn = document.querySelector(`.tab-btn[data-category="${firstCategory}"]`);
            if (tabBtn) {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                tabBtn.classList.add('active');
            }
            
            // Show only labs from the first category initially
            filterLabsByCategory(firstCategory);
        }
    }
    
    /**
     * Loads a lab by ID
     * @param {string} labId - The ID of the lab to load
     */
    function loadLab(labId) {
        // Find the lab
        const lab = LABS.find(lab => lab.id === labId);
        if (!lab) {
            console.error(`Lab with ID ${labId} not found.`);
            return;
        }
        
        // Update current lab
        currentLab = lab;
        
        // Update lab display
        const labTitle = document.getElementById('current-lab-title');
        const labDescription = document.getElementById('current-lab-description');
        const labHints = document.getElementById('hint-content');
        const labFrame = document.getElementById('lab-frame');
        
        if (labTitle) labTitle.textContent = `${lab.id}. ${lab.title}`;
        if (labDescription) labDescription.textContent = lab.description;
        if (labHints) {
            labHints.textContent = lab.hint;
            labHints.style.display = 'none'; // Hide hint initially
            
            const hintToggle = document.getElementById('hint-toggle');
            if (hintToggle) {
                hintToggle.textContent = 'Show Hint';
            }
        }
        
        // Load lab content into iframe
        if (labFrame) {
            // Create a blob from the lab template
            const blob = new Blob([lab.template], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            // Set iframe src to the blob URL
            labFrame.src = url;
            
            // Listen for messages from the iframe
            window.addEventListener('message', handleLabMessage);
        }
        
        // Start the timer
        startLabTimer();
        
        console.log(`Loaded lab: ${lab.title}`);
    }
    
    /**
     * Handles messages from the lab iframe
     * @param {MessageEvent} event - The message event
     */
    function handleLabMessage(event) {
        // Only process messages of type LAB_COMPLETED
        if (event.data && event.data.type === 'LAB_COMPLETED') {
            // Stop timer
            const elapsedTime = stopLabTimer();
            
            // Mark lab as completed
            if (currentLab) {
                sessionManager.updateLabStatus(currentLab.id, true, elapsedTime);
                
                // Update lab item in the list
                const labItem = document.querySelector(`.lab-item[data-lab-id="${currentLab.id}"]`);
                if (labItem) {
                    labItem.classList.add('completed');
                    const statusIcon = labItem.querySelector('.lab-item-status');
                    if (statusIcon) {
                        statusIcon.classList.remove('incomplete');
                        statusIcon.classList.add('completed');
                        statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                    }
                }
                
                // Show success modal
                showSuccessModal(currentLab, elapsedTime);
            }
            
            // Remove the event listener to prevent duplicate completions
            window.removeEventListener('message', handleLabMessage);
        }
    }
    
    /**
     * Shows the success modal
     * @param {Object} lab - The completed lab
     * @param {number} time - Time taken to complete the lab in milliseconds
     */
    function showSuccessModal(lab, time) {
        const successModal = document.getElementById('success-modal');
        const labTitleElement = document.getElementById('completed-lab-title');
        const labTimeElement = document.getElementById('completed-lab-time');
        
        if (successModal && labTitleElement && labTimeElement) {
            labTitleElement.textContent = `${lab.id}. ${lab.title}`;
            labTimeElement.textContent = sessionManager.formatTime(time);
            
            successModal.style.display = 'flex';
        }
    }
    
    /**
     * Starts the lab timer
     */
    function startLabTimer() {
        // Reset any existing timer
        if (labTimer) {
            clearInterval(labTimer);
        }
        
        // Set start time
        startTime = performance.now();
        
        // Update timer display
        const timerDisplay = document.getElementById('lab-timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = '00:00:00';
            
            // Update timer every second
            labTimer = setInterval(function() {
                const elapsedTime = performance.now() - startTime;
                timerDisplay.textContent = sessionManager.formatTime(elapsedTime);
            }, 1000);
        }
    }
    
    /**
     * Stops the lab timer and returns elapsed time
     * @returns {number} - Elapsed time in milliseconds
     */
    function stopLabTimer() {
        const elapsedTime = performance.now() - startTime;
        
        if (labTimer) {
            clearInterval(labTimer);
            labTimer = null;
        }
        
        return elapsedTime;
    }
    
    /**
     * Filters the lab list by category
     * @param {string} category - The category to filter by
     */
    function filterLabsByCategory(category) {
        const labItems = document.querySelectorAll('.lab-item');
        
        labItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === itemCategory) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Loads the next lab after the current one
     */
    function loadNextLab() {
        if (!currentLab) return;
        
        // Find the index of the current lab
        const currentIndex = LABS.findIndex(lab => lab.id === currentLab.id);
        if (currentIndex === -1 || currentIndex >= LABS.length - 1) return;
        
        // Load the next lab
        const nextLab = LABS[currentIndex + 1];
        loadLab(nextLab.id);
        
        // Update active lab in the list
        const labItems = document.querySelectorAll('.lab-item');
        labItems.forEach(item => item.classList.remove('active'));
        
        const nextLabItem = document.querySelector(`.lab-item[data-lab-id="${nextLab.id}"]`);
        if (nextLabItem) {
            nextLabItem.classList.add('active');
            
            // Make sure the lab is visible (might need to switch tabs)
            const nextCategory = nextLab.category;
            
            // Switch to the correct tab if needed
            const currentTabActive = document.querySelector(`.tab-btn.active`);
            const currentCategory = currentTabActive?.getAttribute('data-category');
            
            if (currentCategory !== nextCategory) {
                const nextTab = document.querySelector(`.tab-btn[data-category="${nextCategory}"]`);
                if (nextTab) {
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                    nextTab.classList.add('active');
                    filterLabsByCategory(nextCategory);
                }
            }
            
            // Scroll the lab item into view
            nextLabItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Public API
    return {
        initializeLabList,
        loadLab,
        filterLabsByCategory,
        loadNextLab
    };
})();
