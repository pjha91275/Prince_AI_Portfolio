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

### 2. Setup Virtual Environment & Install Dependencies

Run the following commands in your project folder depending on your operating system:

#### 🖥️ Windows (PowerShell / Command Prompt)
```powershell
# 1. Create the virtual environment
python -m venv .venv

# 2. Install dependencies (Using the virtual env's pip directly is safest to avoid path conflicts)
.venv\Scripts\pip install -r requirements.txt
```
> [!TIP]
> If you wish to activate the virtual environment on Windows PowerShell, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` and then `.venv\Scripts\Activate.ps1`. However, running pip/python using `.venv\Scripts\...` directly works without activation!

#### 🍎 macOS / 🐧 Linux
```bash
# 1. Create the virtual environment
python3 -m venv .venv

# 2. Activate the virtual environment
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

### 3. Configure Gemini API Key
To connect the backend to Google Gemini:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Copy `.env.example` to `.env`:
   - On Windows: `copy .env.example .env`
   - On macOS/Linux: `cp .env.example .env`
3. Edit `.env` and add your key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

*(Alternatively, you can test the AI chatbot by pasting your Gemini API Key directly into the **Configurations** drawer inside the chatbot window. The key will be stored locally in your browser's `localStorage`.)*

### 4. Run the Server

#### 🖥️ Windows
```powershell
.venv\Scripts\python app.py
```

#### 🍎 macOS / 🐧 Linux
```bash
python3 app.py
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
