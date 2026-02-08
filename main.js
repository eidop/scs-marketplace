/* ========================================
   Simply Complex - Main JavaScript
   ======================================== */

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initCounterAnimations();
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
    // Parse target value
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
        
        // Easing function
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
    
    init() {
        this.bundle = this.getBundleFromURL();
        this.loadStep();
        this.bindEvents();
    },
    
    getBundleFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('bundle') || 'professional';
    },
    
    loadStep() {
        this.showStep(this.currentStep);
    },
    
    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.setup-step').forEach(s => {
            s.classList.remove('active');
        });
        
        // Show current step
        const currentStepEl = document.getElementById(`step-${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        // Update progress
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
        // Next button
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateCurrentStep()) {
                    this.nextStep();
                }
            });
        });
        
        // Previous button
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => {
                this.prevStep();
            });
        });
        
        // Integration selection
        document.querySelectorAll('.integration-item').forEach(item => {
            item.addEventListener('click', () => {
                this.toggleIntegration(item);
            });
        });
        
        // Deploy button
        const deployBtn = document.getElementById('deploy-btn');
        if (deployBtn) {
            deployBtn.addEventListener('click', () => {
                this.deploySystem();
            });
        }
    },
    
    validateCurrentStep() {
        // Add validation logic per step
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
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Validating & Deploying...';
        
        // Simulate webhook validation
        const results = await this.validateWebhooks();
        
        if (results.allValid) {
            btn.innerHTML = '✓ Deployment Successful!';
            btn.classList.add('success');
            
            // Show success message
            this.showDeploymentSuccess();
        } else {
            btn.innerHTML = '⚠ Deployment Blocked';
            btn.classList.add('error');
            this.showDeploymentErrors(results);
        }
    },
    
    async validateWebhooks() {
        // Simulate API validation
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    allValid: true,
                    checks: [
                        { name: 'CRM Connection', status: 'healthy' },
                        { name: 'Email Service', status: 'healthy' },
                        { name: 'Webhook Endpoint', status: 'healthy' }
                    ]
                });
            }, 2000);
        });
    },
    
    showDeploymentSuccess() {
        const successEl = document.getElementById('deployment-success');
        if (successEl) {
            successEl.classList.remove('hidden');
        }
    },
    
    showDeploymentErrors(results) {
        // Show error details
        console.log('Validation errors:', results);
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
        // Simulated system data
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
                status: 'warning',
                eventsToday: 156,
                failedWebhooks: 3,
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
        
        document.getElementById('total-events').innerText = totalEvents.toLocaleString();
        document.getElementById('failed-webhooks').innerText = totalFailures;
        document.getElementById('healthy-systems').innerText = `${healthySystems}/${this.systems.length}`;
    },
    
    startAutoRefresh() {
        setInterval(() => {
            this.loadSystems();
        }, this.refreshInterval);
    },
    
    bindEvents() {
        // Manual refresh
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
        
        // Simulate re-test
        await new Promise(r => setTimeout(r, 1500));
        
        btn.classList.remove('loading');
        
        // Update system status
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
            
            // Add to activity log
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
        
        // Keep only last 50 entries
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
    
    // Auto remove after 5 seconds
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
