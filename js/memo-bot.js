/**
 * Simply Complex Solutions - Memo-Bot Integration Script
 * v1.0.0
 */

(function() {
    const MEMO_BOT_VERSION = '1.0.0';
    
    // Default Configuration
    const defaults = {
        pageContext: 'general',
        greeting: 'Hello! How can I help you today?',
        themeColor: '#6366f1',
        position: 'bottom-right'
    };

    class MemoBot {
        constructor(options) {
            this.options = { ...defaults, ...options };
            this.isOpen = false;
            this.init();
        }

        init() {
            this.createStyles();
            this.render();
            console.log(`[SCS Memo-Bot] Initialized in ${this.options.pageContext} mode.`);
        }

        createStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .scs-memo-widget {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 10000;
                    font-family: 'Inter', sans-serif;
                }
                
                .scs-memo-launcher {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: ${this.options.themeColor};
                    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.3s;
                    color: white;
                    font-size: 24px;
                }
                
                .scs-memo-launcher:hover {
                    transform: scale(1.1);
                }
                
                .scs-memo-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 360px;
                    height: 500px;
                    background: #12121a;
                    border: 1px solid #2a2a3a;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .scs-memo-header {
                    padding: 20px;
                    background: #1a1a24;
                    border-bottom: 1px solid #2a2a3a;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .scs-memo-status {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                }
                
                .scs-memo-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .scs-memo-msg {
                    padding: 10px 14px;
                    border-radius: 12px;
                    max-width: 80%;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .scs-memo-msg.bot {
                    background: #2a2a3a;
                    color: #e2e8f0;
                    align-self: flex-start;
                }
                
                .scs-memo-msg.user {
                    background: ${this.options.themeColor};
                    color: white;
                    align-self: flex-end;
                }
                
                .scs-memo-input-area {
                    padding: 16px;
                    border-top: 1px solid #2a2a3a;
                    display: flex;
                    gap: 8px;
                }
                
                .scs-memo-input {
                    flex: 1;
                    background: #0a0a0f;
                    border: 1px solid #2a2a3a;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: white;
                    outline: none;
                }
            `;
            document.head.appendChild(style);
        }

        render() {
            const container = document.createElement('div');
            container.className = 'scs-memo-widget';
            container.innerHTML = `
                <div class="scs-memo-launcher" id="scsLauncher">◈</div>
                <div class="scs-memo-window" id="scsWindow">
                    <div class="scs-memo-header">
                        <div class="scs-memo-status"></div>
                        <div>
                            <div style="font-weight: 700; color: white;">SCS Memo-Bot</div>
                            <div style="font-size: 0.75rem; color: #94a3b8;">Context: ${this.options.pageContext}</div>
                        </div>
                    </div>
                    <div class="scs-memo-messages" id="scsMessages">
                        <div class="scs-memo-msg bot">${this.options.greeting}</div>
                    </div>
                    <div class="scs-memo-input-area">
                        <input type="text" class="scs-memo-input" placeholder="Type a message..." id="scsInput">
                    </div>
                </div>
            `;
            document.body.appendChild(container);

            const launcher = document.getElementById('scsLauncher');
            const windowEl = document.getElementById('scsWindow');
            const input = document.getElementById('scsInput');

            launcher.onclick = () => {
                this.isOpen = !this.isOpen;
                windowEl.style.display = this.isOpen ? 'flex' : 'none';
            };

            input.onkeypress = (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    this.addMessage(input.value, 'user');
                    const userMsg = input.value;
                    input.value = '';
                    
                    // Simulate Bot Response
                    setTimeout(() => {
                        this.respondContextually(userMsg);
                    }, 600);
                }
            };
        }

        addMessage(text, side) {
            const msgArea = document.getElementById('scsMessages');
            const msg = document.createElement('div');
            msg.className = `scs-memo-msg ${side}`;
            msg.textContent = text;
            msgArea.appendChild(msg);
            msgArea.scrollTop = msgArea.scrollHeight;
        }

        respondContextually(text) {
            let response = "I'm not sure about that, but our team can help! Feel free to open a ticket.";
            const t = text.toLowerCase();

            if (this.options.pageContext === 'business') {
                if (t.includes('roi') || t.includes('save')) response = "Our ROI calculator shows most clients save 70% on support costs. Would you like a custom breakdown?";
                if (t.includes('price') || t.includes('cost')) response = "We have plans starting from $499/mo for small businesses. Check our Pricing page for more!";
            } else if (this.options.pageContext === 'support') {
                if (t.includes('reset') || t.includes('password')) response = "You can reset your password at scs.io/auth/reset.";
                if (t.includes('status')) response = "All systems are currently operational. No reported issues in the last 24 hours.";
            } else if (this.options.pageContext === 'config') {
                if (t.includes('api')) response = "Our API docs are listed below. Base URL is api.scs.io/v1.";
                if (t.includes('key')) response = "You can find your API key in the 'Security' tab of your dashboard.";
            }

            this.addMessage(response, 'bot');
        }
    }

    // Export to window
    window.initMemoBot = function(options) {
        new MemoBot(options);
    };
})();
