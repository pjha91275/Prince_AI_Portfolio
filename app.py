import os
import re
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Initialize Flask App with standard templates and static folders
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)  # Enable Cross-Origin Resource Sharing

# Helper to load API key
def get_api_key():
    # Priority: 1. Request header 'x-api-key', 2. Environment variable
    header_key = request.headers.get('x-api-key')
    if header_key and header_key.strip() and not header_key.startswith('your_'):
        return header_key.strip()
    
    env_key = os.getenv('GEMINI_API_KEY')
    if env_key and env_key.strip() and not env_key.startswith('your_'):
        return env_key.strip()
    
    return None

# Local Rule-based NLP Responder (Offline / No API Key Fallback)
def local_portfolio_response(user_message):
    msg = user_message.lower().strip()
    
    # 1. Greetings
    if re.search(r'\b(hello|hi|hey|greet|good morning|good afternoon)\b', msg):
        return (
            "Hi there! I am Prince Jha's AI Portfolio Assistant running locally on the Flask server.\n\n"
            "How can I help you explore Prince's projects, skills, education, or career goals today?"
        )
    
    # 2. Portfolio details
    if re.search(r'\b(lab|experiment|exp|iis|purpose|why|portfolio|website|chat|agent|bot)\b', msg):
        return (
            "This portfolio website is engineered to showcase Prince Jha's projects, skills, "
            "and achievements, featuring a built-in assistant powered by Google Gemini API to "
            "provide an interactive and intelligent chat interface."
        )
        
    # 3. About Prince
    if re.search(r'\b(prince|about|who is|profile)\b', msg):
        return (
            "**Prince Jha** is a 3rd Year Computer Engineering student at Thakur College of Engineering and Technology (TCET), Mumbai. "
            "He is a Full Stack Web Developer and an enthusiast of AI-powered systems. "
            "His career goal is to work as a Software Engineer at a top-tier product-based company."
        )
        
    # 4. Education
    if re.search(r'\b(education|study|college|tcet|mumbai|cgpi|marks|hsc|ssc)\b', msg):
        return (
            "Prince Jha's academic credentials:\n\n"
            "- **Bachelor of Engineering (Computer Engineering):** Thakur College of Engineering and Technology (TCET), Mumbai. Current CGPI: **9.25**\n"
            "- **HSC (Class 12):** Maharashtra State Board | **78.83%**\n"
            "- **SSC (Class 10):** Maharashtra State Board | **78.80%**"
        )
        
    # 5. Skills
    if re.search(r'\b(skills|languages|technologies|know|tools|database|frontend|backend)\b', msg):
        return (
            "Prince Jha has a robust technical skillset:\n\n"
            "- **Languages:** C++, Java, JavaScript, Python, C\n"
            "- **Frontend:** HTML5, CSS3, Vanilla JS\n"
            "- **Backend:** Python, Flask, REST APIs\n"
            "- **Databases:** MongoDB, MySQL\n"
            "- **Tools:** Git, GitHub, VS Code, Postman, Linux, MongoDB Atlas/Compass\n"
            "- **CS Fundamentals:** OOP, DBMS, OS, Computer Networks"
        )

    # 6. Projects general
    if re.search(r'\b(projects|work|featured|build|develop)\b', msg):
        return (
            "Prince has built several notable software projects:\n\n"
            "- **SkillBridge:** Placement prep engine featuring resume analysis and DSA tracker.\n"
            "- **Quickzy:** Rapid quick-commerce app with cart functionality and Razorpay integration.\n"
            "- **Blog Management System:** Full stack blogging CRUD platform with JWT security.\n"
            "- **EV Charging Platform:** Station discovery and booking platform.\n\n"
            "Ask me about a specific project (e.g., 'What is SkillBridge?') for more details."
        )

    # 7. Specific Project: SkillBridge
    if re.search(r'\b(skillbridge|placement prep)\b', msg):
        return (
            "🚀 **SkillBridge** is a Placement Preparation Platform built by Prince.\n"
            "Key Features:\n"
            "- AI Resume Analysis & Placement Readiness Score.\n"
            "- Skill Gap Analysis & personalized learning roadmaps.\n"
            "- Embedded DSA tracker and automated Resume synchronization."
        )

    # 8. Specific Project: Quickzy
    if re.search(r'\b(quickzy|quick commerce)\b', msg):
        return (
            "🛒 **Quickzy** is a high-speed Quick Commerce Platform.\n"
            "Key Features:\n"
            "- JWT user authentication & session management.\n"
            "- Interactive shopping cart and wishlist.\n"
            "- Live sandbox payment integration using Razorpay API.\n"
            "- Admin dashboards to manage product items."
        )

    # 9. Specific Project: Blog Management / EV Charging
    if re.search(r'\b(blog|ev charging|charging)\b', msg):
        return (
            "Other notable projects include:\n\n"
            "1. **Blog Management System:** Node/Express blog app utilizing MongoDB. Supports secure user auth, Markdown text rendering, and blog article CRUD actions.\n"
            "2. **EV Charging Platform:** Python/Flask web tool that helps EV users locate nearby charging stations, book timeslots, and receive custom recommendation coordinates."
        )

    # 10. Achievements
    if re.search(r'\b(achievements|dsa solved|repos|commits|hackathons|ieee)\b', msg):
        return (
            "Prince Jha's key accomplishments:\n\n"
            "- Solved **100+ DSA** problems on online judges.\n"
            "- Actively maintains **30+ GitHub** repositories with over **550+ commits**.\n"
            "- Participated in **10+ hackathons** engineering web prototypes.\n"
            "- Recognized as a **Top 8 Finalist** at IEEE Mega Project competition."
        )

    # 11. Contact
    if re.search(r'\b(contact|email|phone|linkedin|github|reach)\b', msg):
        return (
            "You can contact Prince Jha through:\n\n"
            "- 📧 Email: **pjha91275@gmail.com**\n"
            "- 📞 Phone: **+91 98765 43210**\n"
            "- 🐙 GitHub: [github.com/pjha91275](https://github.com/pjha91275/)\n"
            "- 💼 LinkedIn: [linkedin.com/in/prince-jha-dev](https://linkedin.com/in/prince-jha-dev)\n"
            "- 🌐 Portfolio: **princejha.me**"
        )

    # General Fallback
    return (
        "🤖 *Local Fallback Mode Active*\n\n"
        "I am Prince's local assistant. To get generative responses powered by LLM reasoning, "
        "please enter a **Gemini API Key** in the chatbot configurations, or save `GEMINI_API_KEY` in the server's `.env` file.\n\n"
        "However, I can answers questions about Prince's **skills**, **education**, **projects** (SkillBridge, Quickzy), "
        "**achievements**, and **contact** details. Try asking: *'What is SkillBridge?'*"
    )

# 1. Main Route (Serves the rendered index.html)
@app.route('/')
def home():
    return render_template('index.html')

# 2. Status Route
@app.route('/api/status', methods=['GET'])
def get_status():
    api_key_configured = get_api_key() is not None
    return jsonify({
        "status": "online",
        "api_key_configured": api_key_configured,
        "message": "Flask server is active."
    })

# 3. Chat Route (Talks to Gemini API or falls back locally)
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    user_message = data.get('message', '')
    history = data.get('history', [])
    
    if not user_message:
        return jsonify({"error": "No message provided."}), 400
    
    api_key = get_api_key()
    
    if api_key:
        try:
            # Configure Gemini API client
            genai.configure(api_key=api_key)
            
            # Grounding context for Prince Jha
            system_instruction = (
                "You are the helpful AI assistant integrated into Prince Jha's personal portfolio website.\n"
                "Your objective is to answer questions about Prince, his projects, skills, education, career, and achievements.\n\n"
                "Here is Prince Jha's detailed profile:\n"
                "- Name: Prince Jha\n"
                "- Role: 3rd Year Computer Engineering Student & Full Stack Web Developer\n"
                "- Education: Bachelor of Engineering (Computer Engineering) at Thakur College of Engineering and Technology (TCET), Mumbai. CGPI: 9.25. HSC score: 78.83%. SSC score: 78.80%.\n"
                "- Career Goal: To work as a Software Engineer at a top-tier product-based tech company, engineering scalable software and intelligent applications.\n"
                "- Skills:\n"
                "  - Programming Languages: C++, Java, JavaScript, Python, C\n"
                "  - Web Frontend: HTML5, CSS3, Vanilla JS\n"
                "  - Web Backend: Python, Flask, REST APIs\n"
                "  - Databases: MongoDB, MySQL\n"
                "  - Tools: Git, GitHub, VS Code, Postman, Linux, MongoDB Atlas, MongoDB Compass\n"
                "  - CS Fundamentals: Object-Oriented Programming (OOP), Database Management Systems (DBMS), Operating Systems (OS), Computer Networks (CN)\n"
                "- Featured Projects:\n"
                "  1. SkillBridge: A placement preparation dashboard featuring resume parsing/analysis, placement readiness scoring, skills gap analysis, customized learning roadmaps, and DSA practice trackers.\n"
                "  2. Quickzy: A high-performance Quick Commerce storefront implementing secure authentication, product shopping cart, wishlist, Razorpay API integrations, and administrative dashboards.\n"
                "  3. Blog Management System: A blogging system supporting secure JWT authentication, CRUD operations, Node/Express backend, MongoDB, and Markdown rendering.\n"
                "  4. EV Charging Platform: Discovery, localization, and booking engine for EV charging stations featuring mapping coordinates and user recommendations.\n"
                "- Achievements:\n"
                "  - Solved 100+ DSA algorithmic problems.\n"
                "  - Maintains 30+ GitHub repositories and made 550+ code commits.\n"
                "  - Participated in 10+ student hackathons.\n"
                "  - Ranked in the Top 8 Finalist team at IEEE Mega Project competition.\n"
                "- Contact info:\n"
                "  - Email: pjha91275@gmail.com\n"
                "  - Phone: +91 98765 43210\n"
                "  - LinkedIn: linkedin.com/in/prince-jha-dev\n"
                "  - GitHub: github.com/pjha91275/\n"
                "  - Portfolio Website: princejha.me (Current layout)\n\n"
                "Guidelines:\n"
                "1. Always keep responses concise, accurate, and relevant. Formulate outputs in friendly, professional Markdown.\n"
                "2. When discussing Prince, speak either in the first person as his AI representative (e.g., 'Prince's projects include...') or refer to him in the third person.\n"
                "3. If the user asks general or programming-related questions unrelated to Prince (e.g., 'What is an Intelligent Agent?' or 'Write a bubble sort in Java'), answer them normally, accurately, and politely, demonstrating high-quality AI capability."
            )
            
            # Use gemini-2.0-flash for responsive chat sessions
            model = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                system_instruction=system_instruction
            )
            
            # Map history format for Gemini API
            gemini_history = []
            for item in history:
                role = item.get('role', 'user')
                # Gemini expects 'model' instead of 'assistant'
                if role == 'assistant':
                    role = 'model'
                text = item.get('text', '')
                if text:
                    gemini_history.append({
                        'role': role,
                        'parts': [text]
                    })
            
            # Start conversational session
            chat_session = model.start_chat(history=gemini_history)
            response = chat_session.send_message(user_message)
            
            return jsonify({
                "response": response.text,
                "source": "gemini-api"
            })
            
        except Exception as e:
            print(f"Gemini API Exception: {str(e)}")
            fallback_response = local_portfolio_response(user_message)
            return jsonify({
                "response": f"*(Gemini API experienced a timeout/error; falling back to local reasoning)*\n\n{fallback_response}",
                "source": "local-fallback",
                "error": str(e)
            })
    else:
        # Keyless fallback - execute local NLP rule-matching
        response_text = local_portfolio_response(user_message)
        return jsonify({
            "response": response_text,
            "source": "local-fallback"
        })

# Serve assets/images & assets/resume dynamically if accessed directly
@app.route('/static/assets/images/<path:filename>')
def serve_images(filename):
    return send_from_directory(os.path.join('static', 'assets', 'images'), filename)

@app.route('/static/assets/resume/<path:filename>')
def serve_resume(filename):
    return send_from_directory(os.path.join('static', 'assets', 'resume'), filename)

if __name__ == '__main__':
    # Start local server on standard port 5000
    app.run(debug=True, host='127.0.0.1', port=5000)
