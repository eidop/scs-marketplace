/* ========================================
   Simply Complex Solutions - Main JavaScript
   ======================================== */

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initCounterAnimations();
    SetupFlow.init();
});

/* Mobile Menu */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* Scroll Animations */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-ready');
        observer.observe(section);
    });

    // Observe cards
    document.querySelectorAll('.solution-card, .pricing-card, .step').forEach(card => {
        card.classList.add('animate-ready');
        observer.observe(card);
    });
}

/* Counter Animations */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.metric-value, .stat-value');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.innerText;
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const hasPercent = target.includes('%');
    const hasDollar = target.includes('$');
    const hasK = target.includes('K');
    const hasM = target.includes('M');
    
    let numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    let duration = 2000;
    let startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = numericTarget * easeOut;
        let display = Math.round(current).toString();
        
        if (hasDollar) display = '$' + display;
        if (hasPercent) display += '%';
        if (hasK && current < 100) display = current.toFixed(1) + 'K';
        if (hasM) display = (current / 1).toFixed(1) + 'M';
        
        element.innerText = display;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ========================================
   Setup Flow JavaScript
   ======================================== */

const SetupFlow = {
    currentStep: 1,
    bundle: null,
    integrations: {},
    gumroadLinks: {
        starter: 'https://gum.co/scs-starter',
        professional: 'https://gum.co/scs-professional',
        enterprise: 'https://gum.co/scs-enterprise'
    },
    
    init() {
        this.bundle = this.getBundleFromURL();
        this.loadStep();
        this.bindEvents();
        this.updateBundleDisplay();
    },
    
    getBundleFromURL() {
        const params = new URLSearchParams(window.location.search);
        const bundle = params.get('bundle') || 'professional';
        return bundle.toLowerCase();
    },
    
    updateBundleDisplay() {
        const bundleNameEl = document.getElementById('bundle-name');
        const bundlePriceEl = document.querySelector('.bundle-price .price');
        
        const bundleNames = {
            starter: 'Starter Bundle',
            professional: 'Professional Bundle',
            enterprise: 'Enterprise Bundle'
        };
        
        const bundlePrices = {
            starter: '$247/mo',
            professional: '$597/mo',
            enterprise: '$1,497/mo'
        };
        
        if (bundleNameEl) {
            bundleNameEl.textContent = bundleNames[this.bundle] || 'Professional Bundle';
        }
        if (bundlePriceEl) {
            bundlePriceEl.textContent = bundlePrices[this.bundle] || '$597/mo';
        }
    },
    
    loadStep() {
        this.showStep(this.currentStep);
    },
    
    showStep(step) {
        document.querySelectorAll('.setup-step').forEach(s => {
            s.classList.remove('active');
        });
        
        const currentStepEl = document.getElementById(`step-${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        this.updateProgress(step);
    },
    
    updateProgress(step) {
        document.querySelectorAll('.progress-step').forEach((el, index) => {
            el.classList.remove('active', 'completed');
            if (index + 1 < step) {
                el.classList.add('completed');
            } else if (index + 1 === step) {
                el.classList.add('active');
            }
        });
    },
    
    bindEvents() {
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateCurrentStep()) {
                    this.nextStep();
                }
            });
        });
        
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => {
                this.prevStep();
            });
        });
        
        document.querySelectorAll('.integration-item').forEach(item => {
            item.addEventListener('click', () => {
                this.toggleIntegration(item);
            });
        });
        
        const deployBtn = document.getElementById('deploy-btn');
        if (deployBtn) {
            deployBtn.addEventListener('click', () => {
                this.deploySystem();
            });
        }
    },
    
    validateCurrentStep() {
        if (this.currentStep === 2) {
            const email = document.getElementById('contact-email');
            const company = document.getElementById('company-name');
            
            if (email && !email.value.includes('@')) {
                alert('Please enter a valid email address');
                return false;
            }
            if (company && !company.value.trim()) {
                alert('Please enter your company name');
                return false;
            }
        }
        return true;
    },
    
    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.loadStep();
        }
    },
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.loadStep();
        }
    },
    
    toggleIntegration(item) {
        const id = item.dataset.integration;
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
        }
        
        item.classList.toggle('selected');
        
        if (item.classList.contains('selected')) {
            this.integrations[id] = true;
        } else {
            delete this.integrations[id];
        }
    },
    
    async deploySystem() {
        const btn = document.getElementById('deploy-btn');
        const webhookStatus = document.getElementById('webhook-validation');
        
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Validating Webhooks...';
        
        // Update webhook status to show validation in progress
        if (webhookStatus) {
            webhookStatus.classList.add('validating');
            webhookStatus.querySelector('.icon').textContent = '⟳';
        }
        
        // Validate webhooks
        const results = await this.validateWebhooks();
        
        // Update webhook status
        if (webhookStatus) {
            webhookStatus.classList.remove('validating');
            if (results.allValid) {
                webhookStatus.classList.add('success');
                webhookStatus.querySelector('.icon').textContent = '✓';
            } else {
                webhookStatus.classList.add('error');
                webhookStatus.querySelector('.icon').textContent = '✗';
            }
        }
        
        if (results.allValid) {
            btn.innerHTML = '✓ Webhooks Validated!';
            btn.classList.add('success');
            
            // Redirect to Gumroad after brief delay
            setTimeout(() => {
                this.redirectToGumroad();
            }, 1000);
        } else {
            btn.innerHTML = '⚠ Validation Failed';
            btn.classList.add('error');
            btn.disabled = false;
            
            // Show errors
            alert('Some webhooks failed validation:\n\n' + 
                  results.errors.map(e => `• ${e.name}: ${e.error}`).join('\n'));
        }
    },
    
    async validateWebhooks() {
        // Simulate webhook validation
        // In production, this would make actual HTTP requests to test endpoints
        
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate all webhooks passing (90% of the time)
                const allValid = Math.random() > 0.1;
                
                if (allValid) {
                    resolve({
                        allValid: true,
                        checks: [
                            { name: 'Webhook Endpoint', status: 'healthy', latency: '45ms' },
                            { name: 'SSL Certificate', status: 'valid' },
                            { name: 'Authentication', status: 'passed' }
                        ]
                    });
                } else {
                    resolve({
                        allValid: false,
                        errors: [
                            { name: 'Webhook Endpoint', error: 'Connection timeout' }
                        ]
                    });
                }
            }, 2000);
        });
    },
    
    redirectToGumroad() {
        const gumroadUrl = this.gumroadLinks[this.bundle] || this.gumroadLinks.professional;
        
        // Store session data
        sessionStorage.setItem('scs_bundle', this.bundle);
        sessionStorage.setItem('scs_integrations', JSON.stringify(Object.keys(this.integrations)));
        
        // Redirect to Gumroad
        window.location.href = gumroadUrl;
    },
    
    showDeploymentSuccess() {
        const successEl = document.getElementById('deployment-success');
        if (successEl) {
            successEl.classList.remove('hidden');
        }
    }
};

/* ========================================
   Dashboard JavaScript
   ======================================== */

const Dashboard = {
    refreshInterval: 30000,
    systems: [],
    
    init() {
        this.loadSystems();
        this.startAutoRefresh();
        this.bindEvents();
    },
    
    loadSystems() {
        this.systems = [
            {
                id: 'sales-001',
                name: 'Sales Excellence',
                status: 'healthy',
                eventsToday: 1247,
                failedWebhooks: 0,
                lastActivity: '2 min ago'
            },
            {
                id: 'support-001',
                name: 'Support Automation',
                status: 'healthy',
                eventsToday: 892,
                failedWebhooks: 0,
                lastActivity: '5 min ago'
            },
            {
                id: 'hiring-001',
                name: 'Hiring System',
                status: 'healthy',
                eventsToday: 156,
                failedWebhooks: 0,
                lastActivity: '12 min ago'
            }
        ];
        
        this.renderSystems();
        this.updateStats();
    },
    
    renderSystems() {
        const container = document.getElementById('systems-list');
        if (!container) return;
        
        container.innerHTML = this.systems.map(system => `
            <div class="system-card" data-system="${system.id}">
                <div class="system-header">
                    <span class="status-indicator ${system.status}"></span>
                    <h4>${system.name}</h4>
                </div>
                <div class="system-stats">
                    <div class="stat">
                        <span class="stat-value">${system.eventsToday.toLocaleString()}</span>
                        <span class="stat-label">Events Today</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value ${system.failedWebhooks > 0 ? 'warning' : ''}">${system.failedWebhooks}</span>
                        <span class="stat-label">Failed Webhooks</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${system.lastActivity}</span>
                        <span class="stat-label">Last Activity</span>
                   .html
                    </div>
                </div>
                <div class="system-actions">
                    <button class="btn-icon" onclick="Dashboard.retestWebhooks('${system.id}')" title="Retest Webhooks">
                        🔄
                    </button>
                    <button class="btn-icon ${system.status === 'paused' ? 'resume' : 'pause'}" 
                            onclick="Dashboard.toggleSystem('${system.id}')" 
                            title="${system.status === 'paused' ? 'Resume' : 'Pause'}">
                        ${system.status === 'paused' ? '▶' : '⏸'}
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    updateStats() {
        const totalEvents = this.systems.reduce((sum, s) => sum + s.eventsToday, 0);
        const totalFailures = this.systems.reduce((sum, s) => sum + s.failedWebhooks, 0);
        const healthySystems = this.systems.filter(s => s.status === 'healthy').length;
        
        const totalEl = document.getElementById('total-events');
        const failedEl = document.getElementById('failed-webhooks');
        const healthyEl = document.getElementById('healthy-systems');
        
        if (totalEl) totalEl.innerText = totalEvents.toLocaleString();
        if (failedEl) failedEl.innerText = totalFailures;
        if (healthyEl) healthyEl.innerText = `${healthySystems}/${this.systems.length}`;
    },
    
    startAutoRefresh() {
        setInterval(() => {
            this.loadSystems();
        }, this.refreshInterval);
    },
    
    bindEvents() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSystems();
            });
        }
    },
    
    async retestWebhooks(systemId) {
        const btn = event.target;
        btn.classList.add('loading');
        
        await new Promise(r => setTimeout(r, 1500));
        
        btn.classList.remove('loading');
        
        const system = this.systems.find(s => s.id === systemId);
        if (system) {
            system.failedWebhooks = 0;
            system.status = 'healthy';
            this.renderSystems();
            this.updateStats();
        }
    },
    
    toggleSystem(systemId) {
        const system = this.systems.find(s => s.id === systemId);
        if (system) {
            system.status = system.status === 'healthy' ? 'paused' : 'healthy';
            this.renderSystems();
        }
    },
    
    addEvent(systemId, event) {
        const system = this.systems.find(s => s.id === systemId);
        if (system) {
            system.eventsToday++;
            this.updateStats();
            this.addActivityLog(event);
        }
    },
    
    addActivityLog(event) {
        const log = document.getElementById('activity-log');
        if (!log) return;
        
        const entry = document.createElement('div');
        entry.className = 'activity-entry';
        entry.innerHTML = `
            <span class="activity-time">${new Date().toLocaleTimeString()}</span>
            <span class="activity-message">${event}</span>
        `;
        
        log.insertBefore(entry, log.firstChild);
        
        while (log.children.length > 50) {
            log.removeChild(log.lastChild);
        }
    }
};

/* ========================================
   Utility Functions
   ======================================== */

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
