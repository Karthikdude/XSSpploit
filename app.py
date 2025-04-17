import os
import logging
import json
from flask import Flask, render_template, request, redirect, url_for, session, jsonify

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "xssploit_default_secret_key")

# List of all 50 labs with their information
labs = [
    {
        "id": "1",
        "title": "Basic Reflected XSS via Query Parameters",
        "category": "basic-reflected",
        "difficulty": "Beginner"
    },
    {
        "id": "2",
        "title": "Reflected XSS via Form Submission",
        "category": "basic-reflected",
        "difficulty": "Beginner"
    },
    {
        "id": "3",
        "title": "Reflected XSS in URL Fragments",
        "category": "basic-reflected",
        "difficulty": "Beginner"
    },
    {
        "id": "4",
        "title": "Reflected XSS in URL Path Segments",
        "category": "basic-reflected",
        "difficulty": "Beginner"
    },
    {
        "id": "5",
        "title": "Reflected XSS via HTTP Referrer Header Reflection",
        "category": "basic-reflected",
        "difficulty": "Intermediate"
    },
    {
        "id": "6",
        "title": "Reflected XSS via Cookies",
        "category": "basic-reflected",
        "difficulty": "Intermediate"
    },
    {
        "id": "7",
        "title": "Reflected XSS via User-Agent Header",
        "category": "basic-reflected",
        "difficulty": "Intermediate"
    },
    {
        "id": "8",
        "title": "Reflected XSS via HTML Tags",
        "category": "basic-reflected",
        "difficulty": "Beginner"
    },
    {
        "id": "9",
        "title": "Reflected XSS via Error Messages",
        "category": "basic-reflected",
        "difficulty": "Intermediate"
    },
    {
        "id": "10",
        "title": "Reflected XSS via Open Redirect",
        "category": "basic-reflected",
        "difficulty": "Intermediate"
    },
    {
        "id": "11",
        "title": "DOM-based XSS via innerHTML",
        "category": "dom-based",
        "difficulty": "Beginner"
    },
    {
        "id": "12",
        "title": "DOM-based XSS via document.write",
        "category": "dom-based",
        "difficulty": "Beginner"
    },
    {
        "id": "13",
        "title": "DOM-based XSS via eval()",
        "category": "dom-based",
        "difficulty": "Intermediate"
    },
    {
        "id": "14",
        "title": "DOM-based XSS via JavaScript Events",
        "category": "dom-based",
        "difficulty": "Intermediate"
    },
    {
        "id": "15",
        "title": "DOM-based XSS via window.location.href",
        "category": "dom-based",
        "difficulty": "Intermediate"
    },
    {
        "id": "16",
        "title": "DOM-based XSS via document.location",
        "category": "dom-based",
        "difficulty": "Intermediate"
    },
    {
        "id": "17",
        "title": "DOM-based XSS via element.setAttribute()",
        "category": "dom-based",
        "difficulty": "Intermediate"
    },
    {
        "id": "18",
        "title": "DOM-based XSS via Dynamic Event Listeners",
        "category": "dom-based",
        "difficulty": "Advanced"
    },
    {
        "id": "19",
        "title": "DOM-based XSS via Misuse of innerText",
        "category": "dom-based",
        "difficulty": "Intermediate"
    },
    {
        "id": "20",
        "title": "DOM-based XSS via JavaScript URI",
        "category": "dom-based",
        "difficulty": "Intermediate"
    },
    {
        "id": "21",
        "title": "XSS via CSP Bypass",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "22",
        "title": "XSS via JSON Response Reflection",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "23",
        "title": "XSS via JSONP Endpoint",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "24",
        "title": "XSS via Misconfigured Access-Control-Allow-Origin Header",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "25",
        "title": "XSS via srcdoc Attribute in iframes",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "26",
        "title": "XSS via HTML5 sandbox Attribute Misuse",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "27",
        "title": "XSS via Base64-Encoded Payload Injection",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "28",
        "title": "XSS via SVG Embedded JavaScript",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "29",
        "title": "XSS via Mutation Observers",
        "category": "advanced",
        "difficulty": "Expert"
    },
    {
        "id": "30",
        "title": "XSS via Misuse of window.name Attribute",
        "category": "advanced",
        "difficulty": "Advanced"
    },
    {
        "id": "31",
        "title": "XSS Bypass with Blacklisted Tags",
        "category": "filter-bypass",
        "difficulty": "Intermediate"
    },
    {
        "id": "32",
        "title": "XSS Bypass using URL Encoding/Decoding",
        "category": "filter-bypass",
        "difficulty": "Intermediate"
    },
    {
        "id": "33",
        "title": "XSS Bypass using Double Encoding",
        "category": "filter-bypass",
        "difficulty": "Advanced"
    },
    {
        "id": "34",
        "title": "XSS Bypass using Null Bytes Injection",
        "category": "filter-bypass",
        "difficulty": "Advanced"
    },
    {
        "id": "35",
        "title": "XSS Bypass using Case-Insensitive Tags and Attributes",
        "category": "filter-bypass",
        "difficulty": "Intermediate"
    },
    {
        "id": "36",
        "title": "XSS Bypass with Invalid/Incomplete HTML Tags",
        "category": "filter-bypass",
        "difficulty": "Advanced"
    },
    {
        "id": "37",
        "title": "XSS Bypass with Event Handlers",
        "category": "filter-bypass",
        "difficulty": "Advanced"
    },
    {
        "id": "38",
        "title": "XSS Bypass via Inline Style Injection",
        "category": "filter-bypass",
        "difficulty": "Advanced"
    },
    {
        "id": "39",
        "title": "XSS Bypass via Template Injection",
        "category": "filter-bypass",
        "difficulty": "Expert"
    },
    {
        "id": "40",
        "title": "XSS Bypass using Unescaped Characters in Attributes",
        "category": "filter-bypass",
        "difficulty": "Advanced"
    },
    {
        "id": "41",
        "title": "XSS via iframe Injection",
        "category": "miscellaneous",
        "difficulty": "Intermediate"
    },
    {
        "id": "42",
        "title": "XSS via HTTP Response Splitting",
        "category": "miscellaneous",
        "difficulty": "Expert"
    },
    {
        "id": "43",
        "title": "XSS via HTTP Content-Type Header Reflection",
        "category": "miscellaneous",
        "difficulty": "Advanced"
    },
    {
        "id": "44",
        "title": "XSS via Misconfigured Progressive Web App Manifest",
        "category": "miscellaneous",
        "difficulty": "Expert"
    },
    {
        "id": "45",
        "title": "XSS via Service Worker Registration",
        "category": "miscellaneous",
        "difficulty": "Expert"
    },
    {
        "id": "46",
        "title": "XSS via Inline Event Handlers in Dynamically Injected Content",
        "category": "miscellaneous",
        "difficulty": "Advanced"
    },
    {
        "id": "47",
        "title": "XSS via Template Literals in JavaScript",
        "category": "miscellaneous",
        "difficulty": "Intermediate"
    },
    {
        "id": "48",
        "title": "XSS via CSS Injection in <style> Tags",
        "category": "miscellaneous",
        "difficulty": "Advanced"
    },
    {
        "id": "49",
        "title": "XSS via DOM Clobbering",
        "category": "miscellaneous",
        "difficulty": "Expert"
    },
    {
        "id": "50",
        "title": "XSS via Dynamic Script Source Injection",
        "category": "miscellaneous",
        "difficulty": "Advanced"
    }
]

# Get lab by ID
def get_lab_by_id(lab_id):
    for lab in labs:
        if lab["id"] == lab_id:
            return lab
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/legal')
def legal():
    return render_template('legal.html')

@app.route('/lab/<lab_id>')
def lab(lab_id):
    # Get lab details
    lab_data = get_lab_by_id(lab_id)
    if lab_data is None:
        return redirect(url_for('index'))
    
    # Render the lab template with the lab data
    return render_template('lab.html', lab=lab_data, firebase={})

@app.route('/api/labs')
def api_labs():
    return jsonify(labs)

@app.route('/api/labs/<lab_id>')
def api_lab_by_id(lab_id):
    lab_data = get_lab_by_id(lab_id)
    if lab_data is None:
        return jsonify({"error": "Lab not found"}), 404
    return jsonify(lab_data)

@app.route('/api/user/progress', methods=['POST'])
def update_user_progress():
    data = request.json
    user_id = data.get('userId')
    lab_id = data.get('labId')
    completed = data.get('completed', False)
    time_taken = data.get('time', 0)
    
    if not user_id or not lab_id:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        # For now, we'll just acknowledge the update
        # In a production app, this would be stored in a database
        return jsonify({
            "success": True,
            "message": "Progress tracked client-side only"
        }), 200
    except Exception as e:
        logging.error(f"Error updating user progress: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/progress/<user_id>')
def get_user_progress(user_id):
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    try:
        # For now, just return an empty progress object
        # In a production app, this would be retrieved from a database
        return jsonify({"progress": {}}), 200
    except Exception as e:
        logging.error(f"Error getting user progress: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def get_leaderboard():
    if request.method == 'POST':
        try:
            # Store leaderboard entry
            data = request.json
            username = data.get('username', 'Anonymous')
            total_time = data.get('totalTime', 0)
            
            # In a production app, this would be stored in a database
            logging.info(f"Received leaderboard entry: {username}, {total_time}")
            
            return jsonify({"success": True}), 200
        except Exception as e:
            logging.error(f"Error updating leaderboard: {e}")
            return jsonify({"error": str(e)}), 500
    else:
        try:
            # Return empty leaderboard - will be populated by client-side code
            return jsonify([]), 200
        except Exception as e:
            logging.error(f"Error getting leaderboard: {e}")
            return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
