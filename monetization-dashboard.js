// Dashboard de Monetización - Controlador principal
// Gestión de planes de monetización gamificados

class MonetizationDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.monetizationPlanner = new MonetizationPlanner();
        this.plans = new Map();
        this.challenges = new Map();
        this.activities = [];
        
        // Mock data for demonstration
        this.initializeMockData();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSection('overview');
        this.startRealTimeUpdates();
        this.showWelcomeMessage();
    }
    
    initializeMockData() {
        // Create some mock plans for demonstration
        const mockPlans = [
            {
                id: 'plan_barcelona_2025',
                travelName: 'Viaje Fin de Curso Barcelona',
                destination: 'Barcelona, España',
                totalBudget: 8500,
                currentAmount: 6250,
                numParticipants: 25,
                departureDate: '2025-03-15',
                status: 'active',
                progress: 73,
                challenges: 8,
                completedChallenges: 6,
                createdAt: new Date('2025-01-10')
            },
            {
                id: 'plan_pirineos_2025',
                travelName: 'Aventura Pirineos Extrema',
                destination: 'Pirineos, España',
                totalBudget: 7200,
                currentAmount: 2100,
                numParticipants: 18,
                departureDate: '2025-04-10',
                status: 'active',
                progress: 29,
                challenges: 12,
                completedChallenges: 3,
                createdAt: new Date('2025-01-20')
            },
            {
                id: 'plan_paris_2025',
                travelName: 'París Cultural Inmersivo',
                destination: 'París, Francia',
                totalBudget: 9500,
                currentAmount: 9500,
                numParticipants: 22,
                departureDate: '2025-01-20',
                status: 'completed',
                progress: 100,
                challenges: 10,
                completedChallenges: 10,
                createdAt: new Date('2024-12-15')
            }
        ];
        
        mockPlans.forEach(plan => {
            this.plans.set(plan.id, plan);
        });
        
        // Mock activities
        this.activities = [
            {
                type: 'milestone',
                message: '¡Se ha alcanzado el 75% del objetivo en el Viaje Barcelona!',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                planId: 'plan_barcelona_2025'
            },
            {
                type: 'challenge',
                message: 'Reto "Cena Benéfica Gaudí" completado exitosamente',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                planId: 'plan_barcelona_2025'
            },
            {
                type: 'plan_created',
                message: 'Nuevo plan creado: Aventura Pirineos Extrema',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                planId: 'plan_pirineos_2025'
            },
            {
                type: 'milestone',
                message: '¡Plan París Cultural completado con éxito!',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                planId: 'plan_paris_2025'
            }
        ];
    }
    
    bindEvents() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        // Form submission
        const createPlanForm = document.getElementById('createPlanForm');
        if (createPlanForm) {
            createPlanForm.addEventListener('submit', (e) => this.handleCreatePlan(e));
        }
        
        // Filter controls
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterPlans());
        }
        
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', () => this.sortPlans());
        }
    }
    
    navigateToSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionName;
            this.loadSection(sectionName);
        }
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    loadSection(sectionName) {
        switch (sectionName) {
            case 'overview':
                this.loadOverview();
                break;
            case 'create-plan':
                this.loadCreatePlan();
                break;
            case 'active-plans':
                this.loadActivePlans();
                break;
            case 'challenges':
                this.loadChallenges();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }
    
    loadOverview() {
        this.renderActivePlansPreview();
        this.renderRecentActivity();
        this.animateStatsCards();
    }
    
    loadCreatePlan() {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const departureInput = document.getElementById('departureDate');
        if (departureInput) {
            departureInput.min = tomorrow.toISOString().split('T')[0];
        }
    }
    
    loadActivePlans() {
        this.renderPlansGrid();
    }
    
    loadChallenges() {
        this.renderChallengesGrid();
    }
    
    loadAnalytics() {
        this.showNotification('Módulo de análisis en desarrollo', 'info');
    }
    
    loadSettings() {
        this.showNotification('Configuración en desarrollo', 'info');
    }
    
    renderActivePlansPreview() {
        const container = document.getElementById('activePlansPreview');
        if (!container) return;
        
        const activePlans = Array.from(this.plans.values())
            .filter(plan => plan.status === 'active')
            .slice(0, 3);
        
        container.innerHTML = activePlans.map(plan => this.createPlanCard(plan, true)).join('');
    }
    
    renderPlansGrid() {
        const container = document.getElementById('plansGrid');
        if (!container) return;
        
        const plans = Array.from(this.plans.values());
        container.innerHTML = plans.map(plan => this.createPlanCard(plan, false)).join('');
    }
    
    createPlanCard(plan, isPreview = false) {
        const statusClass = this.getStatusClass(plan.status);
        const progressColor = this.getProgressColor(plan.progress);
        
        return `
            <div class="card-hover glass rounded-2xl p-6 ${isPreview ? 'slide-in-up' : ''}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-white">${plan.travelName}</h3>
                    <span class="status-${plan.status} text-xs px-2 py-1 rounded font-medium">
                        ${this.getStatusText(plan.status)}
                    </span>
                </div>
                
                <div class="space-y-3 mb-6">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-400">Destino:</span>
                        <span class="text-white">${plan.destination}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-400">Participantes:</span>
                        <span class="text-white">${plan.numParticipants}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-400">Salida:</span>
                        <span class="text-white">${new Date(plan.departureDate).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-gray-400">Progreso</span>
                        <span class="text-sm font-bold text-${progressColor}-400">${plan.progress}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-3">
                        <div class="progress-bar h-3 rounded-full" style="width: ${plan.progress}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-400 mt-1">
                        <span>€${plan.currentAmount.toLocaleString()}</span>
                        <span>€${plan.totalBudget.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between text-sm mb-4">
                    <span class="text-gray-400">Retos:</span>
                    <span class="text-white">${plan.completedChallenges || 0}/${plan.challenges}</span>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="viewPlanDetails('${plan.id}')" 
                            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        ${isPreview ? 'Ver' : 'Gestionar'}
                    </button>
                    ${!isPreview ? `
                        <button onclick="exportPlan('${plan.id}')" 
                                class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            📊
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    renderChallengesGrid() {
        const container = document.getElementById('challengesGrid');
        if (!container) return;
        
        // Generate mock challenges based on active plans
        const challenges = this.generateMockChallenges();
        container.innerHTML = challenges.map(challenge => this.createChallengeCard(challenge)).join('');
    }
    
    generateMockChallenges() {
        const challenges = [];
        const challengeTypes = [
            { title: "Cena Benéfica Temática", difficulty: "easy", revenue: 250 },
            { title: "Escape Room Solidario", difficulty: "medium", revenue: 400 },
            { title: "Maratón de Juegos", difficulty: "easy", revenue: 180 },
            { title: "Subasta de Objetos", difficulty: "medium", revenue: 350 },
            { title: "Hackathon Solidario", difficulty: "hard", revenue: 800 },
            { title: "Festival Musical", difficulty: "hard", revenue: 600 }
        ];
        
        let id = 1;
        Array.from(this.plans.values()).forEach(plan => {
            const planChallenges = challengeTypes.slice(0, Math.floor(Math.random() * 3) + 2);
            planChallenges.forEach(template => {
                challenges.push({
                    id: id++,
                    planId: plan.id,
                    planName: plan.travelName,
                    title: template.title,
                    difficulty: template.difficulty,
                    targetAmount: template.revenue,
                    currentAmount: Math.floor(template.revenue * (plan.progress / 100)),
                    progress: plan.progress,
                    participants: Math.floor(Math.random() * 15) + 5,
                    deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
                });
            });
        });
        
        return challenges;
    }
    
    createChallengeCard(challenge) {
        const difficultyClass = `difficulty-${challenge.difficulty}`;
        const progressColor = this.getProgressColor(challenge.progress);
        
        return `
            <div class="challenge-card rounded-2xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white">${challenge.title}</h3>
                    <span class="${difficultyClass} text-xs px-2 py-1 rounded font-medium uppercase">
                        ${challenge.difficulty}
                    </span>
                </div>
                
                <div class="text-sm text-gray-400 mb-4">
                    ${challenge.planName}
                </div>
                
                <div class="space-y-3 mb-6">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Objetivo:</span>
                        <span class="text-white font-bold">€${challenge.targetAmount}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Recaudado:</span>
                        <span class="text-${progressColor}-400 font-bold">€${challenge.currentAmount}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Participantes:</span>
                        <span class="text-white">${challenge.participants}</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="progress-bar h-2 rounded-full" style="width: ${challenge.progress}%"></div>
                    </div>
                    <div class="text-right text-xs text-gray-400 mt-1">${challenge.progress}% completado</div>
                </div>
                
                <div class="text-xs text-gray-400 mb-4">
                    Límite: ${challenge.deadline.toLocaleDateString()}
                </div>
                
                <div class="flex gap-2">
                    <button onclick="manageChallenge(${challenge.id})" 
                            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Gestionar
                    </button>
                    <button onclick="viewChallengeDetails(${challenge.id})" 
                            class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        👁️
                    </button>
                </div>
            </div>
        `;
    }
    
    renderRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        const recentActivities = this.activities.slice(0, 5);
        
        container.innerHTML = recentActivities.map(activity => `
            <div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div class="text-2xl">
                    ${this.getActivityIcon(activity.type)}
                </div>
                <div class="flex-1">
                    <div class="text-sm text-white">${activity.message}</div>
                    <div class="text-xs text-gray-400">
                        ${this.getTimeAgo(activity.timestamp)}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    async handleCreatePlan(e) {
        e.preventDefault();
        
        // Show loading state
        this.showGenerateLoading();
        
        // Collect form data
        const formData = {
            travelName: document.getElementById('travelName').value,
            destination: document.getElementById('destination').value,
            departureDate: document.getElementById('departureDate').value,
            numParticipants: parseInt(document.getElementById('numParticipants').value),
            totalBudget: parseInt(document.getElementById('totalBudget').value),
            initialAmount: parseInt(document.getElementById('initialAmount').value) || 0,
            travelType: document.getElementById('travelType').value,
            difficultyLevel: document.getElementById('difficultyLevel').value,
            mandatoryActivities: document.getElementById('mandatoryActivities').value,
            additionalNotes: document.getElementById('additionalNotes').value
        };
        
        // Simulate API processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
            // Generate monetization plan
            const plan = this.monetizationPlanner.generateMonetizationPlan(
                formData.totalBudget,
                formData.departureDate,
                formData.numParticipants,
                formData.destination
            );
            
            // Add custom data to plan
            plan.travelName = formData.travelName;
            plan.travelType = formData.travelType;
            plan.mandatoryActivities = formData.mandatoryActivities;
            plan.additionalNotes = formData.additionalNotes;
            plan.initialAmount = formData.initialAmount;
            
            // Store the plan
            this.plans.set(plan.id, plan);
            
            // Hide loading and show preview
            this.hideGenerateLoading();
            this.showPlanPreview(plan);
            
            // Add to activities
            this.activities.unshift({
                type: 'plan_created',
                message: `Nuevo plan creado: ${plan.travelName}`,
                timestamp: new Date(),
                planId: plan.id
            });
            
        } catch (error) {
            this.hideGenerateLoading();
            this.showNotification(`Error: ${error.message}`, 'error');
        }
    }
    
    showGenerateLoading() {
        const button = document.getElementById('generatePlanBtn');
        const text = document.getElementById('generateText');
        const loading = document.getElementById('generateLoading');
        
        button.disabled = true;
        text.classList.add('hidden');
        loading.classList.remove('hidden');
    }
    
    hideGenerateLoading() {
        const button = document.getElementById('generatePlanBtn');
        const text = document.getElementById('generateText');
        const loading = document.getElementById('generateLoading');
        
        button.disabled = false;
        text.classList.remove('hidden');
        loading.classList.add('hidden');
    }
    
    showPlanPreview(plan) {
        const container = document.getElementById('planPreview');
        if (!container) return;
        
        container.classList.remove('hidden');
        container.innerHTML = `
            <div class="glass rounded-2xl p-8 border border-green-400/30">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-green-400 mb-4">✨ Plan Generado Exitosamente</h2>
                    <p class="text-gray-400">El Genio Djink ha creado un plan personalizado para ti</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <div class="space-y-4">
                        <h3 class="text-xl font-bold text-blue-300">📍 Información del Viaje</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Nombre:</span>
                                <span class="text-white">${plan.travelName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Destino:</span>
                                <span class="text-white">${plan.destination}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Participantes:</span>
                                <span class="text-white">${plan.numPeople}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Fecha de Salida:</span>
                                <span class="text-white">${new Date(plan.departureDate).toLocaleDateString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Plazo:</span>
                                <span class="text-white">${plan.timeFrame} días</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <h3 class="text-xl font-bold text-green-300">💰 Objetivo Financiero</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Presupuesto Total:</span>
                                <span class="text-green-400 font-bold">€${plan.totalBudget.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Monto Inicial:</span>
                                <span class="text-blue-400">€${plan.currentAmount.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Por Persona:</span>
                                <span class="text-white">€${Math.round(plan.totalBudget / plan.numPeople)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Semanas de Recaudación:</span>
                                <span class="text-white">${Math.ceil(plan.timeFrame / 7)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-8">
                    <h3 class="text-xl font-bold text-purple-300 mb-4">🎯 Resumen del Plan</h3>
                    <div class="grid md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${plan.challenges.length}</div>
                            <div class="text-xs text-gray-400">Retos Totales</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-400">${Math.ceil(plan.timeFrame / 7)}</div>
                            <div class="text-xs text-gray-400">Semanas de Retos</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-400">${plan.milestones.length}</div>
                            <div class="text-xs text-gray-400">Hitos a Alcanzar</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-400">${plan.rewards.individual.length + plan.rewards.group.length}</div>
                            <div class="text-xs text-gray-400">Recompensas</div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-8">
                    <h3 class="text-xl font-bold text-red-300 mb-4">⚠️ Evaluación de Riesgo</h3>
                    <div class="flex items-center gap-4">
                        <div class="px-4 py-2 rounded-lg ${this.getRiskClass(plan.riskAssessment.level)}">
                            Riesgo: ${plan.riskAssessment.level}
                        </div>
                        <div class="text-sm text-gray-400">
                            ${plan.riskAssessment.mitigation.length} estrategias de mitigación activas
                        </div>
                    </div>
                </div>
                
                <div class="text-center space-x-4">
                    <button onclick="activatePlan('${plan.id}')" 
                            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                        🚀 Activar Plan
                    </button>
                    <button onclick="customizePlan('${plan.id}')" 
                            class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                        ⚙️ Personalizar
                    </button>
                    <button onclick="exportPlan('${plan.id}')" 
                            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                        📊 Exportar
                    </button>
                </div>
            </div>
        `;
        
        // Scroll to preview
        container.scrollIntoView({ behavior: 'smooth' });
    }
    
    getStatusClass(status) {
        const classes = {
            active: 'status-active',
            completed: 'status-completed',
            paused: 'status-paused',
            cancelled: 'status-cancelled'
        };
        return classes[status] || 'status-active';
    }
    
    getStatusText(status) {
        const texts = {
            active: 'Activo',
            completed: 'Completado',
            paused: 'Pausado',
            cancelled: 'Cancelado'
        };
        return texts[status] || 'Activo';
    }
    
    getProgressColor(progress) {
        if (progress >= 75) return 'green';
        if (progress >= 50) return 'blue';
        if (progress >= 25) return 'yellow';
        return 'red';
    }
    
    getRiskClass(risk) {
        const classes = {
            'Low': 'bg-green-500/30 text-green-400',
            'Medium': 'bg-yellow-500/30 text-yellow-400',
            'High': 'bg-red-500/30 text-red-400'
        };
        return classes[risk] || classes['Low'];
    }
    
    getActivityIcon(type) {
        const icons = {
            milestone: '🏆',
            challenge: '🎯',
            plan_created: '✨',
            sale: '💰',
            reward: '🎁'
        };
        return icons[type] || '📋';
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) return `Hace ${minutes} minutos`;
        if (hours < 24) return `Hace ${hours} horas`;
        if (days < 7) return `Hace ${days} días`;
        return timestamp.toLocaleDateString();
    }
    
    animateStatsCards() {
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
                card.style.opacity = '0';
                card.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }, 100);
            }, index * 200);
        });
    }
    
    filterPlans() {
        // Implementation for filtering plans
        this.renderPlansGrid();
    }
    
    sortPlans() {
        // Implementation for sorting plans
        this.renderPlansGrid();
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateRealTimeData();
        }, 30000);
    }
    
    updateRealTimeData() {
        // Simulate small changes in plan progress
        this.plans.forEach(plan => {
            if (plan.status === 'active' && plan.progress < 100) {
                const increment = Math.random() * 2; // 0-2% progress
                plan.currentAmount += Math.round((plan.totalBudget * increment) / 100);
                plan.progress = Math.min(100, Math.round((plan.currentAmount / plan.totalBudget) * 100));
                
                if (plan.progress >= 100) {
                    plan.status = 'completed';
                }
            }
        });
        
        // Update UI if in relevant section
        if (this.currentSection === 'overview') {
            this.renderActivePlansPreview();
        } else if (this.currentSection === 'active-plans') {
            this.renderPlansGrid();
        }
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('¡Bienvenido al Dashboard de Monetización! El Genio Djink está listo para crear planes mágicos de recaudación.', 'success');
        }, 1000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">${icon}</span>
                <div>
                    <div class="font-bold">${type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}</div>
                    <div class="text-sm">${message}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Global functions for button actions
function viewPlanDetails(planId) {
    const plan = monetizationDashboard.plans.get(planId);
    if (plan) {
        monetizationDashboard.showNotification(`Mostrando detalles de: ${plan.travelName}`, 'info');
        // In a real implementation, this would open a detailed modal
    }
}

function exportPlan(planId) {
    const plan = monetizationDashboard.plans.get(planId);
    if (plan) {
        monetizationDashboard.showNotification(`Exportando plan: ${plan.travelName}`, 'info');
        // In a real implementation, this would trigger a download
    }
}

function exportAllPlans() {
    monetizationDashboard.showNotification('Exportando todos los planes...', 'info');
    // In a real implementation, this would generate a comprehensive report
}

function activatePlan(planId) {
    monetizationDashboard.showNotification('¡Plan activado exitosamente! El sistema comenzará a ejecutar los retos automáticamente.', 'success');
    // In a real implementation, this would activate the plan in the system
}

function customizePlan(planId) {
    monetizationDashboard.showNotification('Abriendo editor de personalización...', 'info');
    // In a real implementation, this would open a customization interface
}

function viewChallengeDetails(challengeId) {
    monetizationDashboard.showNotification(`Mostrando detalles del reto #${challengeId}`, 'info');
    // In a real implementation, this would open a detailed modal
}

function manageChallenge(challengeId) {
    monetizationDashboard.showNotification(`Gestionando reto #${challengeId}`, 'info');
    // In a real implementation, this would open a management interface
}

// Initialize dashboard
let monetizationDashboard;

document.addEventListener('DOMContentLoaded', function() {
    monetizationDashboard = new MonetizationDashboard();
    
    // Add some visual enhancements
    addVisualEffects();
});

function addVisualEffects() {
    // Add sparkle effect to genio
    setInterval(() => {
        const genio = document.querySelector('.genio-active');
        if (genio && Math.random() > 0.8) {
            createSparkleEffect(genio);
        }
    }, 5000);
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card-hover, .challenge-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width || '0%';
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

function createSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'float 2s ease-out forwards';
    sparkle.style.fontSize = '16px';
    sparkle.style.color = '#f59e0b';
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    
    setTimeout(() => {
        if (element.contains(sparkle)) {
            element.removeChild(sparkle);
        }
    }, 2000);
}

// Export for global access
window.monetizationDashboard = monetizationDashboard;