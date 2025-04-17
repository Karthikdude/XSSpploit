"""
Generate placeholder files for all 50 XSS labs.
This script creates basic HTML files for labs 5-50 with a template structure.
"""

import os

# Make sure the labs directory exists
os.makedirs('static/labs', exist_ok=True)

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XSS Lab {lab_id}</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 2rem;
            background-color: #f4f7fa;
            color: #333;
            line-height: 1.6;
        }}
        
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        h1 {{
            color: #3c66c4;
            margin-top: 0;
        }}
        
        p {{
            margin-bottom: 1.5rem;
        }}
        
        .notice {{
            background-color: #fff3cd;
            padding: 1rem;
            border-left: 4px solid #ffc107;
            margin-bottom: 1.5rem;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>XSS Lab #{lab_id}</h1>
        <div class="notice">
            <p>This is a placeholder for lab #{lab_id}: {lab_title}</p>
            <p>To solve this lab, you'll need to insert code that displays an alert with the text "Xpwned".</p>
        </div>
        
        <div id="lab-content">
            <p>Lab content placeholder. For a complete implementation, replace this with the actual lab content.</p>
        </div>
    </div>

    <script>
        // Minimal success detection script for the lab
        window.addEventListener('error', function(e) {{
            if (e.message && e.message.includes('Xpwned')) {{
                window.parent.postMessage({{
                    type: 'LAB_COMPLETED',
                    labId: '{lab_id}'
                }}, '*');
            }}
        }});
        
        // Success detection via DOM mutations
        const observer = new MutationObserver(function(mutations) {{
            mutations.forEach(function(mutation) {{
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {{
                    for (let i = 0; i < mutation.addedNodes.length; i++) {{
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1 && node.outerHTML && 
                            node.outerHTML.includes('alert') && 
                            node.outerHTML.includes('Xpwned')) {{
                            window.parent.postMessage({{
                                type: 'LAB_COMPLETED',
                                labId: '{lab_id}'
                            }}, '*');
                        }}
                    }}
                }}
            }});
        }});
        
        observer.observe(document.body, {{
            childList: true,
            subtree: true
        }});
    </script>
</body>
</html>
"""

# Lab titles from our labs array
lab_titles = [
    "Basic Reflected XSS via Query Parameters",  # 1
    "Reflected XSS via Form Submission",         # 2
    "Reflected XSS in URL Fragments",            # 3
    "Reflected XSS in URL Path Segments",        # 4
    "Reflected XSS via HTTP Referrer Header Reflection",  # 5
    "Reflected XSS via Cookies",                 # 6
    "Reflected XSS via User-Agent Header",       # 7
    "Reflected XSS via HTML Tags",               # 8
    "Reflected XSS via Error Messages",          # 9
    "Reflected XSS via Open Redirect",           # 10
    "DOM-based XSS via innerHTML",               # 11
    "DOM-based XSS via document.write",          # 12
    "DOM-based XSS via eval()",                  # 13
    "DOM-based XSS via JavaScript Events",       # 14
    "DOM-based XSS via window.location.href",    # 15
    "DOM-based XSS via document.location",       # 16
    "DOM-based XSS via element.setAttribute()",  # 17
    "DOM-based XSS via Dynamic Event Listeners", # 18
    "DOM-based XSS via Misuse of innerText",     # 19
    "DOM-based XSS via JavaScript URI",          # 20
    "XSS via CSP Bypass",                        # 21
    "XSS via JSON Response Reflection",          # 22
    "XSS via JSONP Endpoint",                    # 23
    "XSS via Misconfigured Access-Control-Allow-Origin Header",  # 24
    "XSS via srcdoc Attribute in iframes",       # 25
    "XSS via HTML5 sandbox Attribute Misuse",    # 26
    "XSS via Base64-Encoded Payload Injection",  # 27
    "XSS via SVG Embedded JavaScript",           # 28
    "XSS via Mutation Observers",                # 29
    "XSS via Misuse of window.name Attribute",   # 30
    "XSS Bypass with Blacklisted Tags",          # 31
    "XSS Bypass using URL Encoding/Decoding",    # 32
    "XSS Bypass using Double Encoding",          # 33
    "XSS Bypass using Null Bytes Injection",     # 34
    "XSS Bypass using Case-Insensitive Tags and Attributes",  # 35
    "XSS Bypass with Invalid/Incomplete HTML Tags",  # 36
    "XSS Bypass with Event Handlers",            # 37
    "XSS Bypass via Inline Style Injection",     # 38
    "XSS Bypass via Template Injection",         # 39
    "XSS Bypass using Unescaped Characters in Attributes",  # 40
    "XSS via iframe Injection",                  # 41
    "XSS via HTTP Response Splitting",           # 42
    "XSS via HTTP Content-Type Header Reflection",  # 43
    "XSS via Misconfigured Progressive Web App Manifest",  # 44
    "XSS via Service Worker Registration",       # 45
    "XSS via Inline Event Handlers in Dynamically Injected Content",  # 46
    "XSS via Template Literals in JavaScript",   # 47
    "XSS via CSS Injection in <style> Tags",     # 48
    "XSS via DOM Clobbering",                    # 49
    "XSS via Dynamic Script Source Injection"    # 50
]

# Generate lab files for labs 5-50
for lab_id in range(5, 51):
    lab_title = lab_titles[lab_id - 1]
    
    # Create directory if it doesn't exist
    lab_dir = f'static/labs/{lab_id}'
    os.makedirs(lab_dir, exist_ok=True)
    
    # Create index.html for the lab
    with open(f'{lab_dir}/index.html', 'w') as f:
        f.write(TEMPLATE.format(lab_id=lab_id, lab_title=lab_title))
    
    print(f"Created lab {lab_id}: {lab_title}")

print("All lab files have been created successfully!")