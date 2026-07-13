document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. DOM Elements
    const backendBadge = document.getElementById('backend-status-badge');
    const backendStatusText = document.getElementById('backend-status-text');
    
    // Chatbot Panel Toggles
    const chatbotFloatBtn = document.getElementById('chatbot-float-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const heroChatBtn = document.getElementById('hero-chat-btn');
    
    // Chat Form & Input
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatContainer = document.getElementById('chat-messages-container');
    const promptChips = document.querySelectorAll('.prompt-chip');
    
    // Chat Settings Drawer
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsClose = document.getElementById('settings-close');
    const settingsDrawer = document.getElementById('settings-drawer');
    const geminiKeyInput = document.getElementById('gemini-key');
    const toggleKeyVisibilityBtn = document.getElementById('toggle-key-visibility');
    const activeAiMode = document.getElementById('active-ai-mode');
    const saveSettingsBtn = document.getElementById('save-settings');
    const clearChatBtn = document.getElementById('clear-chat');

    // Contact Form
    const contactForm = document.getElementById('portfolio-contact-form');

    // State Variables
    let isBackendConnected = false;
    let chatHistory = []; // Tracks [{role: 'user'|'assistant', text: '...'}]
    let showKey = false;

    // Load saved Gemini Key from localStorage
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    if (savedKey) {
        geminiKeyInput.value = savedKey;
    }

    // 3. API Base URL
    const API_BASE = window.location.origin;

    // 4. Check Flask Backend Status
    async function checkBackendStatus() {
        try {
            const res = await fetch(`${API_BASE}/api/status`);
            if (res.ok) {
                const data = await res.json();
                isBackendConnected = true;
                backendBadge.classList.add('connected');
                backendStatusText.textContent = 'Backend Active';
                updateAiModeDisplay(data.api_key_configured);
            } else {
                throw new Error('Status not OK');
            }
        } catch (err) {
            isBackendConnected = false;
            backendBadge.classList.remove('connected');
            backendStatusText.textContent = 'Offline Fallback';
            updateAiModeDisplay(false);
        }
    }

    // Run backend check on load, and poll every 15 seconds
    checkBackendStatus();
    setInterval(checkBackendStatus, 15000);

    // 5. Navigation Control Logic

    // 6. Chatbot Overlay Controls
    const openChat = () => {
        chatbotWindow.classList.add('open');
        chatbotFloatBtn.style.transform = 'scale(0) rotate(-45deg)';
    };

    const closeChat = () => {
        chatbotWindow.classList.remove('open');
        chatbotFloatBtn.style.transform = 'scale(1) rotate(0)';
    };

    chatbotFloatBtn.addEventListener('click', openChat);
    chatbotCloseBtn.addEventListener('click', closeChat);
    if (heroChatBtn) {
        heroChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openChat();
            // Optional: scroll slightly to center the widget on mobile
        });
    }

    // 7. Config Drawer & Key Management
    settingsToggle.addEventListener('click', () => {
        settingsDrawer.classList.add('open');
    });

    settingsClose.addEventListener('click', () => {
        settingsDrawer.classList.remove('open');
    });

    toggleKeyVisibilityBtn.addEventListener('click', () => {
        showKey = !showKey;
        geminiKeyInput.type = showKey ? 'text' : 'password';
        const icon = toggleKeyVisibilityBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', showKey ? 'eye-off' : 'eye');
            lucide.createIcons();
        }
    });

    saveSettingsBtn.addEventListener('click', () => {
        const key = geminiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            addSystemMessage("Custom Gemini API Key saved locally. Frontend will use this key for chat requests.");
        } else {
            localStorage.removeItem('gemini_api_key');
            addSystemMessage("Custom Gemini API Key cleared. Defaulting to backend environment key.");
        }
        checkBackendStatus();
        settingsDrawer.classList.remove('open');
    });

    function updateAiModeDisplay(serverKeyConfigured = false) {
        const localKey = localStorage.getItem('gemini_api_key');
        if (localKey && localKey.trim()) {
            activeAiMode.textContent = 'Gemini (Local API Key)';
            activeAiMode.style.color = '#38bdf8'; // Accent Blue Glow
        } else if (serverKeyConfigured) {
            activeAiMode.textContent = 'Gemini (Server Env Key)';
            activeAiMode.style.color = '#34d399'; // Green Glow
        } else {
            activeAiMode.textContent = 'Local Rule-Based Fallback';
            activeAiMode.style.color = '#9ca3af'; // Neutral grey
        }
    }

    // 8. Clear Chat Functionality
    clearChatBtn.addEventListener('click', () => {
        chatHistory = [];
        chatContainer.innerHTML = `
            <div class="message bot">
                <div class="avatar">🤖</div>
                <div class="message-wrapper">
                    <div class="message-bubble">
                        Hi! I'm Prince's AI Assistant. Ask me anything about Prince, his projects, skills, education, achievements, or software development.
                    </div>
                    <span class="time-stamp">Just now</span>
                </div>
            </div>
        `;
    });

    // 9. Send Chat Message Logic
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msgText = chatInput.value.trim();
        if (!msgText) return;
        submitChatMessage(msgText);
        chatInput.value = '';
    });

    // Quick prompts chip click
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const promptText = chip.getAttribute('data-prompt');
            if (promptText) {
                submitChatMessage(promptText);
            }
        });
    });

    async function submitChatMessage(msgText) {
        // Append user bubble
        appendMessageBubble('user', msgText);
        chatHistory.push({ role: 'user', text: msgText });
        
        // Render typing indicator
        const typingIndicator = appendTypingIndicator();
        scrollToBottom();

        let botReply = '';
        let source = '';

        // Call backend or fallback
        if (isBackendConnected) {
            try {
                const headers = { 'Content-Type': 'application/json' };
                const localKey = localStorage.getItem('gemini_api_key');
                if (localKey) {
                    headers['x-api-key'] = localKey;
                }

                const res = await fetch(`${API_BASE}/api/chat`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        message: msgText,
                        history: chatHistory.slice(0, -1) // Send context excluding current query
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    botReply = data.response;
                    source = data.source; // 'gemini-api' or 'local-fallback'
                } else {
                    const errData = await res.json();
                    botReply = `⚠️ API Error: ${errData.error || 'Server rejected request'}`;
                    source = 'error';
                }
            } catch (err) {
                console.error("Fetch failed, running client-side fallback:", err);
                botReply = clientSideOfflineFallback(msgText);
                source = 'client-offline';
            }
        } else {
            // Backend offline - use client-side rules
            botReply = clientSideOfflineFallback(msgText);
            source = 'client-offline';
        }

        // Remove indicator & append bot bubble
        typingIndicator.remove();
        appendMessageBubble('bot', botReply, source);
        chatHistory.push({ role: 'assistant', text: botReply });
        scrollToBottom();
    }

    // 10. Append Bubble Helpers
    function appendMessageBubble(role, text, source = '') {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isBot = role === 'bot';
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', role);

        let parsedHtml = formatMarkdownResponse(text);

        // Append source badge if executing on bot response
        if (isBot && source) {
            let label = '';
            let style = '';
            if (source === 'gemini-api') {
                label = 'Gemini Cloud AI';
                style = 'background: rgba(37,99,235,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.25);';
            } else if (source === 'local-fallback') {
                label = 'Local Python Rule-Engine';
                style = 'background: rgba(255,255,255,0.05); color: #9ca3af; border: 1px solid rgba(255,255,255,0.08);';
            } else {
                label = 'Browser Offline Engine';
                style = 'background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2);';
            }
            parsedHtml += `<div style="margin-top: 0.6rem; font-size: 0.68rem; display: inline-flex; align-items: center; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; ${style}">${label}</div>`;
        }

        msgDiv.innerHTML = `
            <div class="avatar">${isBot ? '🤖' : '👤'}</div>
            <div class="message-wrapper">
                <div class="message-bubble">${parsedHtml}</div>
                <span class="time-stamp">${time}</span>
            </div>
        `;
        chatContainer.appendChild(msgDiv);
    }

    function addSystemMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'system-msg');
        msgDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'bot');
        msgDiv.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="message-wrapper">
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        return msgDiv;
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 11. Simple Custom Markdown Parser for Chat Responses
    function formatMarkdownResponse(text) {
        if (!text) return '';
        
        let html = text;
        // Escape standard HTML injection
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Block code formatting: ```js ... ```
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            return `<pre style="background: rgba(0,0,0,0.3); padding: 0.6rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.78rem; overflow-x: auto; margin: 0.5rem 0; color: #38bdf8;"><code>${code.trim()}</code></pre>`;
        });

        // Inline code formatting: `code`
        html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 0.1rem 0.3rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; color: #38bdf8;">$1</code>');

        // Bold formatting: **text**
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 600;">$1</strong>');

        // Bullets formatting: - or *
        html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li style="margin-left: 1rem; margin-bottom: 0.25rem; font-size: 0.88rem; color: var(--text-secondary);">$1</li>');

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    // 12. Client-Side Offline Fallback (Regex-based answers about Prince Jha)
    function clientSideOfflineFallback(msgText) {
        const query = msgText.toLowerCase().trim();
        
        if (query.includes('project') || query.includes('work') || query.includes('portfolio')) {
            return "Prince Jha has engineered several projects:\n\n" +
                   "1. **SkillBridge** - Placement preparation platform with Resume Analysis, Gap Analysis, roadmaps, and DSA trackers.\n" +
                   "2. **Quickzy** - A fast-loading Quick Commerce website featuring cart, wishlist, payments, and admin boards.\n" +
                   "3. **Blog Management System** - A Full Stack Node/Express blogging framework with JWT authentication and CRUD operations.\n" +
                   "4. **EV Charging Platform** - A station locator and booking engine with smart recommendations.";
        }
        if (query.includes('skill') || query.includes('technolog') || query.includes('know') || query.includes('language')) {
            return "Prince's technology skillset is grouped as:\n" +
                   "- **Programming:** C++, Java, JavaScript, Python, C\n" +
                   "- **Frontend:** HTML5, CSS3, Vanilla JS\n" +
                   "- **Backend:** Python, Flask, REST APIs\n" +
                   "- **Database:** MongoDB, MySQL\n" +
                   "- **Developer Tools:** Git, GitHub, VS Code, Postman, Linux";
        }
        if (query.includes('colleg') || query.includes('educat') || query.includes('stud') || query.includes('tcet') || query.includes('cgpi')) {
            return "Prince Jha is a 3rd-year **Computer Engineering** student at **Thakur College of Engineering and Technology (TCET), Mumbai**, maintaining a CGPI of **9.25**.";
        }
        if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach')) {
            return "You can get in touch with Prince Jha via:\n" +
                   "- 📧 Email: **princejha@gmail.com**\n" +
                   "- 📞 Phone: **+91 98765 43210**\n" +
                   "- 💼 LinkedIn: [LinkedIn Profile](https://linkedin.com)\n" +
                   "- 🐙 GitHub: [GitHub Profile](https://github.com)";
        }
        if (query.includes('achievement') || query.includes('dsa') || query.includes('hackathon')) {
            return "Prince's academic accomplishments include:\n" +
                   "- Solved **100+ DSA** challenges.\n" +
                   "- Created **30+ GitHub** repos and pushed **550+ commits**.\n" +
                   "- Competed in **10+ hackathons**.\n" +
                   "- Ranked in **Top 8 Finalist** at IEEE Mega Project competition.";
        }
        if (query.includes('skillbridge')) {
            return "🚀 **SkillBridge** is a Placement Preparation Platform engineered by Prince. It features Resume Analysis, Placement Readiness scoring, Skill Gap analysis, personalized learning roadmaps, and DSA challenge tracking.";
        }
        if (query.includes('quickzy')) {
            return "🛒 **Quickzy** is a Quick Commerce web application featuring secure JWT authentication, user shopping cart/wishlist management, Razorpay payment integrations, and a robust admin management portal.";
        }
        
        return "👋 I am Prince's AI Assistant (Offline Mode).\n\n" +
               "It looks like the Python backend is disconnected, or I cannot reach the server. However, you can ask me about:\n" +
               "- Prince's *skills* or programming *languages*\n" +
               "- His *projects* (like *SkillBridge* or *Quickzy*)\n" +
               "- His *education* (TCET, CGPI)\n" +
               "- *Achievements* (DSA, Hackathons)\n" +
               "- *Contact* information";
    }

    // 13. Achievements Counter Animation
    const countersSection = document.getElementById('counters-box');
    const counters = document.querySelectorAll('.counter-num');
    let countersAnimated = false;

    function startCounterAnimation() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1500; // Animation duration in ms
            const increment = target / (duration / 16); // ~60fps refresh rate

            let currentCount = 0;
            const updateCount = () => {
                currentCount += increment;
                if (currentCount < target) {
                    counter.textContent = Math.ceil(currentCount);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target;
                }
            };
            updateCount();
        });
    }

    if (countersSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    startCounterAnimation();
                    countersAnimated = true;
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(countersSection);
    }

    // 14. Contact Form Submission Notification
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you! Your message has been sent successfully. Prince will get back to you shortly.");
            contactForm.reset();
        });
    }
});
