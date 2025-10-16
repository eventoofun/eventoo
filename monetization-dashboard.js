// Dashboard de Monetización - Controlador principal
// Gestión de planes de monetización gamificados con integración del Plan Executor

class MonetizationDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.monetizationPlanner = new MonetizationPlanner();
        this.planExecutor = new PlanExecutor();
        this.plans = new Map();
        this.challenges = new Map();
        this.activities = [];
        this.activeExecutions = new Map();
        
        // Mock data for demonstration
        this.initializeMockData();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSection('overview');
        this.startRealTimeUpdates();
        this.showWelcomeMessage();
        this.initializePlanExecutor();
    }
    
    initializePlanExecutor() {
        // Configurar callbacks para el plan executor
        this.planExecutor.onProgressUpdate = (planId, progress) => {
            this.updatePlanProgress(planId, progress);
        };
        
        this.planExecutor.onChallengeComplete = (planId, challenge) => {
            this.handleChallengeCompletion(planId, challenge);
        };
        
        this.planExecutor.onActivityLog = (activity) => {
            this.addActivity(activity);
        };
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
                createdAt: new Date('2025-01-10'),
                timeFrame: 8, // semanas
                challenges: [
                    {
                        title: "Cena Benéfica Temática",
                        description: "Organiza una cena donde cada plato representa el destino del viaje",
                        baseRevenue: 150,
                        difficulty: "Fácil",
                        timeRequired: 3,
                        status: "completed"
                    },
                    {
                        title: "Rifa de Experiencias Locales",
                        description: "Sortea experiencias únicas donadas por negocios locales",
                        baseRevenue: 200,
                        difficulty: "Fácil", 
                        timeRequired: 2,
                        status: "active"
                    }
                ]
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
                createdAt: new Date('2025-01-20'),
                timeFrame: 10, // semanas
                challenges: [
                    {
                        title: "Escape Room Solidario",
                        description: "Crea un escape room temático sobre el destino del viaje",
                        baseRevenue: 400,
                        difficulty: "Medio",
                        timeRequired: 5,
                        status: "active"
                    }
                ]
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
                createdAt: new Date('2024-12-15'),
                timeFrame: 6, // semanas
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
        // Navigation events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.loadSection(section);
            });
        });
        
        // Create plan button
        const createPlanBtn = document.getElementById('createPlanBtn');
        if (createPlanBtn) {
            createPlanBtn.addEventListener('click', () => {
                this.showCreatePlanModal();
            });
        }
        
        // Activate plan buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('activate-plan-btn')) {
                const planId = e.target.dataset.planId;
                this.activatePlan(planId);
            }
            
            if (e.target.classList.contains('view-execution-btn')) {
                const planId = e.target.dataset.planId;
                this.viewPlanExecution(planId);
            }
        });
    }
    
    loadSection(section) {
        this.currentSection = section;
        this.updateNavigation(section);
        
        switch(section) {
            case 'overview':
                this.renderOverview();
                break;
            case 'plans':
                this.renderPlans();
                break;
            case 'challenges':
                this.renderChallenges();
                break;
            case 'execution':
                this.renderExecution();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            default:
                this.renderOverview();
        }
    }
    
    updateNavigation(activeSection) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === activeSection) {
                item.classList.add('active');
            }
        });
    }
    
    renderOverview() {
        const mainContent = document.getElementById('mainContent');
        const activePlans = Array.from(this.plans.values()).filter(plan => plan.status === 'active');
        const totalRaised = Array.from(this.plans.values()).reduce((sum, plan) => sum + plan.currentAmount, 0);
        const totalGoal = Array.from(this.plans.values()).reduce((sum, plan) => sum + plan.totalBudget, 0);
        
        mainContent.innerHTML = `
            <div class="p-8">
                <div class="mb-8">
                    <h1 class="text-4xl font-bold text-white mb-2">Dashboard de Monetización</h1>
                    <p class="text-gray-300">Gestión inteligente de la recaudación de fondos para viajes educativos</p>
                </div>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="glass rounded-xl p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-300 text-sm mb-1">Planes Activos</p>
                                <p class="text-3xl font-bold text-white">${activePlans.length}</p>
                            </div>
                            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span class="text-white text-xl">📊</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="glass rounded-xl p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-300 text-sm mb-1">Total Recaudado</p>
                                <p class="text-3xl font-bold text-green-400">€${totalRaised.toLocaleString()}</p>
                            </div>
                            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <span class="text-white text-xl">💰</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="glass rounded-xl p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-300 text-sm mb-1">Progreso Total</p>
                                <p class="text-3xl font-bold text-amber-400">${Math.round((totalRaised/totalGoal) * 100)}%</p>
                            </div>
                            <div class="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                                <span class="text-white text-xl">🎯</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="glass rounded-xl p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-300 text-sm mb-1">Retos Activos</p>
                                <p class="text-3xl font-bold text-purple-400">${this.getActiveChallengesCount()}</p>
                            </div>
                            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                <span class="text-white text-xl">🎮</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="glass rounded-xl p-6 mb-8">
                    <h3 class="text-xl font-semibold text-white mb-4">Acciones Rápidas</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button id="createPlanBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                            🚀 Crear Nuevo Plan
                        </button>
                        <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                            📈 Ver Analytics
                        </button>
                        <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                            🎯 Gestionar Retos
                        </button>
                    </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-semibold text-white mb-4">Actividad Reciente</h3>
                    <div class="space-y-4">
                        ${this.activities.slice(0, 5).map(activity => `
                            <div class="flex items-center space-x-4 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                <div class="flex-1">
                                    <p class="text-white">${activity.message}</p>
                                    <p class="text-gray-400 text-sm">${this.formatTimeAgo(activity.timestamp)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Re-bind create plan button
        const createPlanBtn = document.getElementById('createPlanBtn');
        if (createPlanBtn) {
            createPlanBtn.addEventListener('click', () => {
                this.showCreatePlanModal();
            });
        }
    }
    
    renderPlans() {
        const mainContent = document.getElementById('mainContent');
        const plans = Array.from(this.plans.values());
        
        mainContent.innerHTML = `
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-4xl font-bold text-white">Planes de Monetización</h1>
                    <button id="createPlanBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                        🚀 Crear Nuevo Plan
                    </button>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${plans.map(plan => `
                        <div class="glass rounded-xl p-6 card-hover">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="text-xl font-semibold text-white mb-2">${plan.travelName}</h3>
                                    <p class="text-gray-300">${plan.destination}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-sm ${this.getStatusColor(plan.status)}">
                                    ${this.getStatusText(plan.status)}
                                </span>
                            </div>
                            
                            <div class="mb-4">
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-gray-300">Progreso</span>
                                    <span class="text-white">${plan.progress}%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style="width: ${plan.progress}%"></div>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p class="text-gray-300 text-sm">Objetivo</p>
                                    <p class="text-white font-semibold">€${plan.totalBudget.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p class="text-gray-300 text-sm">Recaudado</p>
                                    <p class="text-green-400 font-semibold">€${plan.currentAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p class="text-gray-300 text-sm">Participantes</p>
                                    <p class="text-white font-semibold">${plan.numParticipants}</p>
                                </div>
                                <div>
                                    <p class="text-gray-300 text-sm">Retos</p>
                                    <p class="text-white font-semibold">${plan.completedChallenges}/${plan.challenges}</p>
                                </div>
                            </div>
                            
                            <div class="flex space-x-2">
                                ${plan.status === 'active' ? `
                                    <button class="view-execution-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors" data-plan-id="${plan.id}">
                                        👁️ Ver Ejecución
                                    </button>
                                ` : ''}
                                ${plan.status !== 'completed' ? `
                                    <button class="activate-plan-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors" data-plan-id="${plan.id}">
                                        ⚡ Activar Plan
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Re-bind events
        this.bindEvents();
    }
    
    renderExecution() {
        const mainContent = document.getElementById('mainContent');
        const executions = Array.from(this.activeExecutions.values());
        
        mainContent.innerHTML = `
            <div class="p-8">
                <h1 class="text-4xl font-bold text-white mb-8">Ejecución de Planes</h1>
                
                ${executions.length === 0 ? `
                    <div class="glass rounded-xl p-12 text-center">
                        <div class="text-6xl mb-4">🚀</div>
                        <h3 class="text-2xl font-semibold text-white mb-2">No hay planes en ejecución</h3>
                        <p class="text-gray-300 mb-6">Activa un plan para comenzar su ejecución automática</p>
                        <button onclick="dashboard.loadSection('plans')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                            Ver Planes Disponibles
                        </button>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        ${executions.map(execution => `
                            <div class="glass rounded-xl p-6">
                                <h3 class="text-xl font-semibold text-white mb-4">${execution.travelName}</h3>
                                
                                <div class="mb-4">
                                    <div class="flex justify-between text-sm mb-2">
                                        <span class="text-gray-300">Progreso de Ejecución</span>
                                        <span class="text-white">${Math.round(execution.executionProgress || 0)}%</span>
                                    </div>
                                    <div class="w-full bg-gray-700 rounded-full h-2">
                                        <div class="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style="width: ${execution.executionProgress || 0}%"></div>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <h4 class="text-white font-semibold mb-2">Reto Actual</h4>
                                    <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                                        <p class="text-white font-medium">${execution.currentChallenge?.title || 'N/A'}</p>
                                        <p class="text-gray-300 text-sm">${execution.currentChallenge?.description || ''}</p>
                                        <div class="mt-2">
                                            <span class="text-green-400 text-sm">€${execution.currentChallenge?.baseRevenue || 0} esperados</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex space-x-2">
                                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        📊 Ver Detalles
                                    </button>
                                    <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        ▶️ Continuar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }
    
    renderChallenges() {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div class="p-8">
                <h1 class="text-4xl font-bold text-white mb-8">Gestión de Retos</h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Challenge Templates -->
                    <div class="glass rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-white mb-4">Plantillas de Retos</h3>
                        <div class="space-y-3">
                            ${this.getChallengeTemplates().map(template => `
                                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <h4 class="text-white font-medium">${template.title}</h4>
                                        <span class="px-2 py-1 bg-${this.getDifficultyColor(template.difficulty)}-600 text-white text-xs rounded">
                                            ${template.difficulty}
                                        </span>
                                    </div>
                                    <p class="text-gray-300 text-sm mb-2">${template.description}</p>
                                    <div class="flex justify-between items-center">
                                        <span class="text-green-400 text-sm">€${template.baseRevenue}</span>
                                        <span class="text-gray-400 text-sm">${template.timeRequired}h</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Active Challenges -->
                    <div class="glass rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-white mb-4">Retos Activos</h3>
                        <div class="space-y-3">
                            ${this.getActiveChallenges().map(challenge => `
                                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <h4 class="text-white font-medium">${challenge.title}</h4>
                                        <span class="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
                                            ${challenge.status}
                                        </span>
                                    </div>
                                    <p class="text-gray-300 text-sm">${challenge.planName}</p>
                                    <div class="mt-2">
                                        <span class="text-green-400 text-sm">€${challenge.baseRevenue} esperados</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAnalytics() {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div class="p-8">
                <h1 class="text-4xl font-bold text-white mb-8">Analytics de Monetización</h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Revenue Chart -->
                    <div class="glass rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-white mb-4">Recaudación por Mes</h3>
                        <div class="h-64 bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-4xl mb-2">📊</div>
                                <p class="text-gray-300">Gráfico de recaudación</p>
                                <p class="text-gray-400 text-sm">Implementación con Chart.js</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Challenge Performance -->
                    <div class="glass rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-white mb-4">Rendimiento de Retos</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-300">Retos Completados</span>
                                    <span class="text-green-400">85%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-300">Recaudación Promedio</span>
                                    <span class="text-blue-400">€245</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-blue-500 h-2 rounded-full" style="width: 75%"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-300">Participación</span>
                                    <span class="text-purple-400">92%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-purple-500 h-2 rounded-full" style="width: 92%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Key Metrics -->
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-semibold text-white mb-4">Métricas Clave</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-400 mb-2">€1,250</div>
                            <div class="text-gray-300">Recaudación Promedio por Plan</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-400 mb-2">6.2</div>
                            <div class="text-gray-300">Retos Promedio por Plan</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-purple-400 mb-2">8.5</div>
                            <div class="text-gray-300">Semanas Promedio de Duración</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-amber-400 mb-2">24</div>
                            <div class="text-gray-300">Participantes Promedio</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Plan Executor Integration Methods
    async activatePlan(planId) {
        const plan = this.plans.get(planId);
        if (!plan) {
            this.showNotification('Plan no encontrado', 'error');
            return;
        }
        
        try {
            // Activar plan usando el PlanExecutor
            const result = await this.planExecutor.activatePlan(plan);
            
            if (result.success) {
                this.activeExecutions.set(planId, {
                    ...plan,
                    executionProgress: 0,
                    currentChallenge: result.nextChallenge,
                    activatedAt: new Date()
                });
                
                this.showNotification(`Plan ${plan.travelName} activado exitosamente`, 'success');
                this.loadSection('execution');
            } else {
                this.showNotification(`Error al activar plan: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Error activating plan:', error);
            this.showNotification('Error al activar el plan', 'error');
        }
    }
    
    viewPlanExecution(planId) {
        this.loadSection('execution');
        // Scroll to specific execution or highlight it
    }
    
    updatePlanProgress(planId, progress) {
        const execution = this.activeExecutions.get(planId);
        if (execution) {
            execution.executionProgress = progress;
            // Update UI if currently viewing execution section
            if (this.currentSection === 'execution') {
                this.renderExecution();
            }
        }
    }
    
    handleChallengeCompletion(planId, challenge) {
        this.addActivity({
            type: 'challenge',
            message: `Reto "${challenge.title}" completado en ${this.plans.get(planId)?.travelName}`,
            timestamp: new Date(),
            planId: planId
        });
        
        this.showNotification(`¡Reto completado! +€${challenge.baseRevenue}`, 'success');
    }
    
    addActivity(activity) {
        this.activities.unshift(activity);
        // Keep only last 50 activities
        this.activities = this.activities.slice(0, 50);
    }
    
    // Utility Methods
    getStatusColor(status) {
        const colors = {
            'active': 'bg-green-600',
            'completed': 'bg-blue-600',
            'paused': 'bg-yellow-600',
            'cancelled': 'bg-red-600'
        };
        return colors[status] || 'bg-gray-600';
    }
    
    getStatusText(status) {
        const texts = {
            'active': 'Activo',
            'completed': 'Completado',
            'paused': 'Pausado',
            'cancelled': 'Cancelado'
        };
        return texts[status] || status;
    }
    
    getDifficultyColor(difficulty) {
        const colors = {
            'Fácil': 'green',
            'Medio': 'yellow',
            'Difícil': 'red'
        };
        return colors[difficulty] || 'gray';
    }
    
    getActiveChallengesCount() {
        return Array.from(this.activeExecutions.values())
            .reduce((count, execution) => count + (execution.currentChallenge ? 1 : 0), 0);
    }
    
    getChallengeTemplates() {
        return this.monetizationPlanner.challengeTemplates?.low?.slice(0, 5) || [];
    }
    
    getActiveChallenges() {
        const challenges = [];
        this.activeExecutions.forEach((execution, planId) => {
            if (execution.currentChallenge) {
                challenges.push({
                    ...execution.currentChallenge,
                    planName: execution.travelName,
                    planId: planId
                });
            }
        });
        return challenges;
    }
    
    formatTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
        return 'hace menos de una hora';
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 
            'bg-blue-600'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    showCreatePlanModal() {
        // This would show a modal for creating a new plan
        this.showNotification('Función de creación de planes próximamente disponible', 'info');
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('🎉 Dashboard de Monetización cargado exitosamente', 'success');
        }, 1000);
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            // Update timestamps in activity feed
            if (this.currentSection === 'overview') {
                // Could refresh activity timestamps here
            }
        }, 60000); // Update every minute
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new MonetizationDashboard();
});