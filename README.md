# AI-Powered Personal Portfolio

A modern, responsive, and glassmorphic personal portfolio website for **Prince Jha**, featuring an integrated **Google Gemini AI** conversational assistant to answer questions about his skills, education, projects, achievements, and career goals.

---

## 👤 Author
* **Name:** Prince Jha
* **Role:** 3rd Year Computer Engineering Student & Full Stack Web Developer
* **College:** Thakur College of Engineering and Technology (TCET), Mumbai
* **Links:** [LinkedIn](https://linkedin.com/in/prince-jha-dev) | [GitHub](https://github.com/pjha91275/) | [Email](mailto:pjha91275@gmail.com) | [Resume](https://drive.google.com/file/d/1zSXDfPcrSPvWcmVW1YmSAWW1mpBpWy0e/view?usp=drive_link) | [Portfolio Website](https://princejha.me)

---

## ✨ Features

* **AI Chat Assistant:** A conversational assistant powered by Google's latest **Gemini API** (`gemini-1.5-flash`), grounded in Prince's detailed portfolio details (projects, skills, achievements, and bio).
* **Local Fallback Engine:** A Python-based rule matching engine in Flask that serves as an offline/keyless backup, responding to portfolio-related queries using pattern-matched responses.
* **Premium Glassmorphic Design:** A sleek, futuristic dark-mode theme utilizing translucent cards, backdrop blur filters (`backdrop-filter`), glowing borders, and floating animated color orbs.
* **Animated Milestones:** Statistics counters for GitHub commits, repositories, and DSA problems solved that animate dynamically when scrolled into view.
* **Configurations Drawer:** An expandable configuration drawer in the chat interface where users can supply their own Gemini API key (stored securely in browser `localStorage`).
* **Fully Responsive:** Adapts to all screen sizes, including desktop monitors, tablets, and mobile devices.

---

## 📂 Project Structure
```text
Prince_AI_Portfolio/
├── app.py                 # Flask server with Chat & Status endpoints
├── requirements.txt       # Python dependency files
├── README.md              # Project documentation
├── .env                   # Local environment variable (Git ignored)
├── .env.example           # Environment template key configuration for GitHub
├── .gitignore             # Git ignored patterns
├── templates/
│   └── index.html         # Single-page glassmorphic portfolio & chatbot UI
└── static/
    ├── style.css          # Premium glassmorphism design styles
    ├── script.js          # Counter animations, scrolling, & chat APIs
    └── assets/
        └── resume/        # Folder for resume files
```

---

## ⚙️ Running the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/pjha91275/Prince_AI_Portfolio.git
cd Prince_AI_Portfolio
```

### 2. Setup Virtual Environment
Run the following commands in the project folder:
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Gemini API Key
To connect the backend to Google Gemini:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

*(Alternatively, you can test the AI chatbot by pasting your Gemini API Key directly into the **Configurations** drawer inside the chatbot window. The key will be stored locally in your browser's `localStorage`.)*

### 5. Run the Server
```bash
python app.py
```
Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your web browser.

---

## 🚀 GitHub Push Commands
To push this portfolio to your GitHub repository:
```bash
# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Commit changes
git commit -m "feat: complete AI-powered portfolio website with Gemini API chatbot"

# Add remote origin
git remote add origin https://github.com/pjha91275/Prince_AI_Portfolio.git

# Push to main branch
git branch -M main
git push -u origin main
```
