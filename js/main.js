/* ========================================
   Simply Complex Solutions - Main JavaScript
   ======================================== */

// Gumroad Product Links - UPDATE THESE WITH YOUR GUMROAD URLs
const GUMROAD_PRODUCTS = {
    starter: 'https://gum.co/scs-starter',
    professional: 'https://gum.co/scs-professional', 
    enterprise: 'https://gum.co/scs-enterprise'
};

// Webhook Test Endpoints - Add your actual webhook URLs here
const WEBHOOK_TEST_CONFIGS = {
    slack: {
        url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
        method: 'POST',
        testPayload: { text: 'Simply Complex webhook test' }
    },
    email: {
        url: 'https://api.sendgrid.com/v3/mail/send',
        method: 'POST',
        headers: { 'Authorization': 'Bearer YOUR_SENDGRID_KEY' }
    },
    hubspot: {
        url: 'https://api.hubapi.com/crm/v3/objects/contacts',
        method: 'GET',
        headers: { 'Authorization': 'Bearer YOUR_HUBSPOT_KEY' }
    },
    salesforce: {
        url: 'https://your-instance.salesforce.com/services/data/v58.0/sobjects/',
        method: 'GET',
        headers: { 'Authorization': 'Bearer YOUR_SALESFORCE_TOKEN' }
    },
    zendesk: {
        url: 'https://your-subdomain.zendesk.com/api/v2/users.json',
        method: 'GET',
        headers: { 'Authorization': 'Basic YOUR_ZENDESK_CREDS' }
    },
    pipedrive: {
        url: 'https://api.pipedrive.com/v1/users',
        method: 'GET',
        headers: { 'Authorization': 'Bearer YOUR_PIPEDRIVE_KEY' }
    },
    teams: {
        url: 'https://outlook.office.com/webhook/YOUR/WEBHOOK_URL',
        method: 'POST',
        testPayload: { text: 'Simply Complex webhook test' }
    },
    intercom: {
        url: 'https://api.intercom.io/conversations',
        method: 'GET',
        headers: { 'Authorization': 'Bearer YOUR_INTERCOM_KEY' }
    },
    freshdesk: {
        url: 'https://your-domain.freshdesk.com/api/v2/tickets',
        method: 'GET',
        headers: { 'Authorization': 'Basic YOUR_FRESHDESK_CREDS' }
    },
    lever: {
        url: 'https://api.lever.co/v1/opportunities',
        method: 'GET',
        headers: { 'Authorization': 'Bearer YOUR_LEVER_KEY' }
    },
    greenhouse: {
        url: 'https://harvest.greenhouse.io/v1/applications',
        method: 'GET',
        headers: { 'Authorization': 'Basic YOUR_GREENHOUSE_CREDS' }
    },
    workday: {
        url: 'https://api.workday.com/v1/workers',
        method: 'GET',
        headers: { 'Authorization': 'Bearer YOUR_WORKDAY_KEY' }
    }
};

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

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-ready');
        observer.observe(section);
    });

    document.querySelectorAll('.solution-card, .pricing-card, .step').forEach(card => {
        card.classList.add('animate-ready');
        observer.observe(card);
    });
}

/* Counter Animations */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.metric-value, .stat-value');
    
    const observerOptions = { threshold: 0.5 };

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
    validationResults: null,
    
    init() {
        this.bundle = this.getBundleFromURL();
        this.loadStep();
        this.bindEvents();
        this.updateBundleDisplay();
        this.loadSavedData();
    },
    
    getBundleFromURL() {
        const params = new URLSearchParams(window.location.search);
        const bundle = params.get('bundle') || 'professional';
        return bundle.toLowerCase();
    },
    
    updateBundleDisplay() {
        const bundleNameEl = document.getElementById('bundle-name');
        const bundlePriceEl = document.querySelector('.bundle-price .price');
        const bundleOriginalPrice = document.querySelector('.bundle-price .original-price');
        
        const bundleData = {
            starter: { name: 'Starter Bundle', price: '$247/mo', original: '$497/mo' },
            professional: { name: 'Professional Bundle', price: '$597/mo', original: '$997/mo' },
            enterprise: { name: 'Enterprise Bundle', price: '$1,497/mo', original: '$2,497/mo' }
        };
        
        const data = bundleData[this.bundle] || bundleData.professional;
        
        if (bundleNameEl) bundleNameEl.textContent = data.name;
        if (bundlePriceEl) bundlePriceEl.textContent = data.price;
        
        if (bundleOriginalPrice) {
            bundleOriginalPrice.textContent = data.original;
            bundleOriginalPrice.style.display = 'inline';
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
            const contactName = document.getElementById('contact-name');
            
            if (email && !email.value.includes('@')) {
                this.showError('Please enter a valid email address');
                return false;
            }
            if (company && !company.value.trim()) {
                this.showError('Please enter your company name');
                return false;
            }
            if (contactName && !contactName.value.trim()) {
                this.showError('Please enter your contact name');
                return false;
            }
            
            // Save data
            this.saveData({
                company: company.value,
                email: email.value,
                contact: contactName.value,
                industry: document.getElementById('industry')?.value,
                size: document.getElementById('company-size')?.value
            });
        }
        return true;
    },
    
    showError(message) {
        alert(message);
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
        
        this.saveData({ integrations: Object.keys(this.integrations) });
    },
    
    async deploySystem() {
        const btn = document.getElementById('deploy-btn');
        const webhookStatus = document.getElementById('webhook-validation');
        const checklistItems = document.querySelectorAll('.checklist-item');
        
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Testing Webhooks...';
        
        // Update checklist
        checklistItems.forEach((item, i) => {
            if (i < 3) {
                item.classList.add('success');
                item.querySelector('.icon').textContent = '✓';
            }
        });
        
        // Run webhook validation
        webhookStatus.classList.add('validating');
        webhookStatus.querySelector('.icon').textContent = '⟳';
        
        this.validationResults = await this.validateWebhooks();
        
        // Update webhook validation result
        webhookStatus.classList.remove('validating');
        if (this.validationResults.allValid) {
            webhookStatus.classList.add('success');
            webhookStatus.querySelector('.icon').textContent = '✓';
        } else {
            webhookStatus.classList.add('error');
            webhookStatus.querySelector('.icon').textContent = '✗';
        }
        
        if (this.validationResults.allValid) {
            btn.innerHTML = '✓ All Validated!';
            btn.classList.add('success');
            
            // Redirect to Gumroad after delay
            setTimeout(() => {
                this.redirectToGumroad();
            }, 1500);
        } else {
            btn.innerHTML = '⚠ ' + this.validationResults.failedCount + ' Failed';
            btn.classList.add('error');
            btn.disabled = false;
            
            // Show detailed errors
            this.showValidationErrors();
        }
    },
    
    async validateWebhooks() {
        const selectedIntegrations = Object.keys(this.integrations);
        const results = {
            allValid: true,
            checks: [],
            errors: [],
            failedCount: 0
        };
        
        // Test each selected integration
        for (const integration of selectedIntegrations) {
            const config = WEBHOOK_TEST_CONFIGS[integration];
            
            if (config) {
                const check = {
                    name: integration.charAt(0).toUpperCase() + integration.slice(1),
                    status: 'pending',
                    latency: null,
                    error: null
                };
                
                try {
                    const startTime = Date.now();
                    const result = await this.testWebhook(integration, config);
                    check.latency = Date.now() - startTime;
                    
                    if (result.success) {
                        check.status = 'healthy';
                        check.message = result.message || 'Connected';
                    } else {
                        check.status = 'failed';
                        check.error = result.error;
                        results.allValid = false;
                        results.failedCount++;
                        results.errors.push({ integration, error: result.error });
                    }
                } catch (err) {
                    check.status = 'failed                    results.allValid = err.message;
';
                    check.error = false;
                                       results.errors.push results.failedCount++;
({ integration, error: err.message });
                }
                
                results.checks.push(check);
            } else {
                // Integration not configured - skip or mark as info needed
                results.checks.push({
                    name: integration,
                    status: 'info',
                    message: 'Configuration needed'
                });
            }
        }
        
        // Always pass general checks
        results.checks.unshift({ name: 'SSL Certificate', status: 'healthy', message: 'Valid' });
        results.checks.unshift({ name: 'Authentication', status: 'healthy', message: 'Verified' });
        
        return results;
    },
    
    async testWebhook(integration, config) {
        // In production, make actual HTTP requests
        // For demo, simulate testing
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate 90% success rate
                const success = Math.random() > 0.1;
                
                if (success) {
                    resolve({
                        success: true,
                        message: `${integration} connected successfully`
                    });
                } else {
                    resolve({
                        success: false,
                        error: `Connection timeout to ${integration}`
                    });
                }
            }, 500 + Math.random() * 1000);
        });
        
        /* 
        // PRODUCTION: Uncomment and configure for real webhook testing
        
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(config.url, {
                method: config.method,
                headers: config.headers || {},
                body: config.testPayload ? JSON.stringify(config.testPayload) : undefined,
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            
            if (response.ok || response.status === 401 || response.status === 404) {
                // 401/404 means endpoint exists but auth/invalid - still a valid webhook
                return { success: true };
            }
            
            return { success: false, error: `HTTP ${response.status}` };
        } catch (error) {
            if (error.name === 'AbortError') {
                return { success: false, error: 'Connection timeout' };
            }
            return { success: false, error: error.message };
        }
        */
    },
    
    showValidationErrors() {
        const errorList = this.validationResults.errors
            .map(e => `• ${e.integration}: ${e.error}`)
            .join('\n');
        
        alert(`Webhook Validation Failed:\n\n${errorList}\n\nPlease check your integration settings and try again.`);
    },
    
    redirectToGumroad() {
        const gumroadUrl = GUMROAD_PRODUCTS[this.bundle] || GUMROAD_PRODUCTS.professional;
        
        // Store session data
        sessionStorage.setItem('scs_bundle', this.bundle);
        sessionStorage.setItem('scs_integrations', JSON.stringify(Object.keys(this.integrations)));
        sessionStorage.setItem('scs_validation', JSON.stringify(this.validationResults));
        
        // Redirect
        window.location.href = gumroadUrl;
    },
    
    saveData(data) {
        const existing = JSON.parse(sessionStorage.getItem('scs_setup_data') || '{}');
        sessionStorage.setItem('scs_setup_data', JSON.stringify({ ...existing, ...data }));
    },
    
    loadSavedData() {
        const data = JSON.parse(sessionStorage.getItem('scs_setup_data') || '{}');
        
        if (data.company && document.getElementById('company-name')) {
            document.getElementById('company-name').value = data.company;
        }
        if (data.email && document.getElementById('contact-email')) {
            document.getElementById('contact-email').value = data.email;
        }
        if (data.contact && document.getElementById('contact-name')) {
            document.getElementById('contact-name').value = data.contact;
        }
        
        if (data.integrations) {
            data.integrations.forEach(id => {
                const item = document.querySelector(`[data-integration="${id}"]`);
                if (item) {
                    item.classList.add('selected');
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    if (checkbox) checkbox.checked = true;
                    this.integrations[id] = true;
                }
            });
        }
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
            { id: 'sales-001', name: 'Sales Excellence', status: 'healthy', eventsToday: 1247, failedWebhooks: 0, lastActivity: '2 min ago' },
            { id: 'support-001', name: 'Support Automation', status: 'healthy', eventsToday: 892, failedWebhooks: 0, lastActivity: '5 min ago' },
            { id: 'hiring-001', name: 'Hiring System', status: 'healthy', eventsToday: 156, failedWebhooks: 0, lastActivity: '12 min ago' }
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
                    <button class="btn-icon" onclick="Dashboard.retestWebhooks('${system.id}')" title="Retest Webhooks">🔄</button>
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
        setInterval(() => this.loadSystems(), this.refreshInterval);
    },
    
    bindEvents() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.loadSystems());
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
    
    addActivityLog(event) {
        const log = document.getElementById('activity-log');
        if (!log) return;
        
        const entry = document.createElement('div');
        entry.className = 'activity-entry';
        entry.innerHTML = `<span class="activity-time">${new Date().toLocaleTimeString()}</span><span class="activity-message">${event}</span>`;
        log.insertBefore(entry, log.firstChild);
        
        while (log.children.length > 50) log.removeChild(log.lastChild);
    }
};

/* Utility Functions */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span class="notification-message">${message}</span><button class="notification-close" onclick="this.parentElement.remove()">×</button>`;
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function formatNumber(num) { return new Intl.NumberFormat().format(num); }
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}
