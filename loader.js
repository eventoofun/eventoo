// Eventoo Dependency Loader
// Sistema de carga de dependencias para Eventoo Cognitive

class EventooLoader {
    constructor() {
        this.dependencies = [
            {
                name: 'MonetizationPlanner',
                path: 'monetization-planner.js',
                required: true
            },
            {
                name: 'PlanExecutor',
                path: 'plan-executor.js',
                required: true
            },
            {
                name: 'EventooNavigation',
                path: 'navigation.js',
                required: true
            },
            {
                name: 'MonetizationDashboard',
                path: 'monetization-dashboard.js',
                required: false
            },
            {
                name: 'EventooApp',
                path: 'main.js',
                required: true
            }
        ];
        
        this.loadedDependencies = new Set();
        this.errors = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.isLoading = true;
        console.log('🔄 Eventoo Loader: Starting dependency loading...');
        
        // Verificar dependencias que ya están cargadas
        this.checkExistingDependencies();
        
        // Cargar dependencias faltantes
        this.loadMissingDependencies().then(() => {
            this.onAllDependenciesLoaded();
        }).catch((error) => {
            this.onLoadingError(error);
        });
    }
    
    checkExistingDependencies() {
        this.dependencies.forEach(dep => {
            if (typeof window[dep.name] !== 'undefined') {
                this.loadedDependencies.add(dep.name);
                console.log(`✅ ${dep.name} already loaded`);
            }
        });
    }
    
    async loadMissingDependencies() {
        const missingDeps = this.dependencies.filter(dep => 
            !this.loadedDependencies.has(dep.name)
        );
        
        if (missingDeps.length === 0) {
            console.log('✅ All dependencies already loaded');
            return;
        }
        
        console.log(`📦 Loading ${missingDeps.length} missing dependencies...`);
        
        // Cargar dependencias en orden secuencial para evitar conflictos
        for (const dep of missingDeps) {
            try {
                await this.loadScript(dep);
                this.loadedDependencies.add(dep.name);
                console.log(`✅ ${dep.name} loaded successfully`);
            } catch (error) {
                this.errors.push({
                    dependency: dep.name,
                    error: error.message
                });
                
                if (dep.required) {
                    throw new Error(`Failed to load required dependency: ${dep.name}`);
                } else {
                    console.warn(`⚠️ Failed to load optional dependency: ${dep.name}`);
                }
            }
        }
    }
    
    loadScript(dependency) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = dependency.path;
            script.async = false; // Cargar sincrónicamente para mantener el orden
            
            script.onload = () => {
                // Verificar que la dependencia se haya cargado correctamente
                setTimeout(() => {
                    if (typeof window[dependency.name] !== 'undefined') {
                        resolve();
                    } else {
                        reject(new Error(`Dependency ${dependency.name} not found after loading`));
                    }
                }, 100);
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${dependency.path}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    onAllDependenciesLoaded() {
        this.isLoading = false;
        console.log('🎉 All dependencies loaded successfully');
        
        if (this.errors.length > 0) {
            console.warn('⚠️ Some dependencies failed to load:', this.errors);
        }
        
        // Notificar que todas las dependencias están cargadas
        this.dispatchEvent('dependenciesLoaded', {
            loaded: Array.from(this.loadedDependencies),
            errors: this.errors
        });
        
        // Intentar inicializar la aplicación principal
        this.tryInitializeApp();
    }
    
    onLoadingError(error) {
        this.isLoading = false;
        console.error('❌ Dependency loading failed:', error);
        
        this.dispatchEvent('dependenciesError', {
            error: error.message,
            errors: this.errors
        });
        
        // Mostrar mensaje de error al usuario
        this.showErrorMessage('Error al cargar la aplicación. Por favor, recarga la página.');
    }
    
    tryInitializeApp() {
        try {
            // Verificar que todas las dependencias requeridas estén disponibles
            const requiredDeps = this.dependencies.filter(dep => dep.required);
            const missingRequiredDeps = requiredDeps.filter(dep => 
                typeof window[dep.name] === 'undefined'
            );
            
            if (missingRequiredDeps.length > 0) {
                throw new Error(`Missing required dependencies: ${missingRequiredDeps.map(d => d.name).join(', ')}`);
            }
            
            // Intentar inicializar cada componente
            this.initializeComponents();
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showErrorMessage('Error al inicializar la aplicación. Por favor, recarga la página.');
        }
    }
    
    initializeComponents() {
        console.log('🚀 Initializing Eventoo components...');
        
        // Inicializar navegación
        if (typeof EventooNavigation !== 'undefined') {
            window.eventooNavigation = new EventooNavigation();
            console.log('✅ EventooNavigation initialized');
        }
        
        // Inicializar dashboard si estamos en la página del dashboard
        if (typeof MonetizationDashboard !== 'undefined' && this.isDashboardPage()) {
            window.dashboard = new MonetizationDashboard();
            console.log('✅ MonetizationDashboard initialized');
        }
        
        // Inicializar aplicación principal
        if (typeof EventooApp !== 'undefined') {
            window.eventooApp = new EventooApp();
            console.log('✅ EventooApp initialized');
        }
        
        console.log('🎉 All components initialized successfully');
    }
    
    isDashboardPage() {
        return window.location.pathname.includes('monetization-dashboard');
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-red-600 bg-opacity-90 flex items-center justify-center z-50';
        errorDiv.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-lg mx-4 text-center">
                <h2 class="text-2xl font-bold text-red-600 mb-4">Error de Inicialización</h2>
                <p class="text-gray-700 mb-4">${message}</p>
                <button onclick="location.reload()" 
                        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Recargar Aplicación
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`eventoo:${eventName}`, {
            detail: data
        });
        document.dispatchEvent(event);
    }
    
    // Métodos de utilidad
    getLoadedDependencies() {
        return Array.from(this.loadedDependencies);
    }
    
    getErrors() {
        return this.errors;
    }
    
    isDependencyLoaded(name) {
        return this.loadedDependencies.has(name);
    }
    
    getLoadingStatus() {
        return {
            isLoading: this.isLoading,
            loaded: this.loadedDependencies.size,
            total: this.dependencies.length,
            errors: this.errors.length
        };
    }
}

// Fallback para dependencias que no se cargaron correctamente
window.MonetizationPlanner = window.MonetizationPlanner || class {
    constructor() {
        console.warn('⚠️ MonetizationPlanner fallback initialized');
        this.challengeTemplates = { low: [], medium: [], high: [] };
        this.rewardTemplates = [];
        this.difficultySettings = {};
    }
    
    initializeChallengeTemplates() {
        return {
            low: [
                {
                    title: "Cena Benéfica Temática",
                    description: "Organiza una cena donde cada plato representa el destino del viaje",
                    baseRevenue: 150,
                    difficulty: "Fácil",
                    timeRequired: 3,
                    resources: ["Cocina accesible", "Voluntarios para cocinar", "Decoración temática"]
                }
            ],
            medium: [
                {
                    title: "Escape Room Solidario",
                    description: "Crea un escape room temático sobre el destino del viaje",
                    baseRevenue: 400,
                    difficulty: "Medio",
                    timeRequired: 5,
                    resources: ["Espacio adecuado", "Materiales para acertijos", "Decoración", "Personal de apoyo"]
                }
            ],
            high: [
                {
                    title: "Festival de Música Multicultural",
                    description: "Organiza un festival con bandas de diferentes culturas relacionadas con el destino",
                    baseRevenue: 800,
                    difficulty: "Difícil",
                    timeRequired: 8,
                    resources: ["Escenario profesional", "Equipo de sonido", "Grupos musicales", "Permisos municipales"]
                }
            ]
        };
    }
    
    initializeRewardTemplates() {
        return [
            { name: "Medalla de Bronce", points: 100, type: "achievement" },
            { name: "Medalla de Plata", points: 250, type: "achievement" },
            { name: "Medalla de Oro", points: 500, type: "achievement" }
        ];
    }
    
    initializeDifficultySettings() {
        return {
            easy: { multiplier: 1.0, timeBonus: 1.0 },
            medium: { multiplier: 1.5, timeBonus: 1.2 },
            hard: { multiplier: 2.0, timeBonus: 1.5 }
        };
    }
};

window.PlanExecutor = window.PlanExecutor || class {
    constructor() {
        console.warn('⚠️ PlanExecutor fallback initialized');
        this.activePlans = new Map();
        this.currentChallenges = new Map();
        this.completedChallenges = new Map();
        this.notifications = [];
        this.marketingCampaigns = new Map();
    }
    
    init() {
        console.log('PlanExecutor fallback init');
    }
    
    async activatePlan(plan) {
        return {
            success: true,
            planId: plan.id || 'fallback_plan',
            message: 'Plan activado (modo fallback)',
            nextChallenge: null
        };
    }
    
    validatePlan(plan) {
        return true;
    }
    
    prepareExecutionPlan(plan) {
        return {
            ...plan,
            status: 'active',
            activatedAt: new Date(),
            currentChallengeIndex: 0,
            weeklyProgress: [],
            totalRaised: plan.currentAmount || 0,
            lastUpdate: new Date(),
            executionLog: []
        };
    }
};

window.EventooNavigation = window.EventooNavigation || class {
    constructor() {
        console.warn('⚠️ EventooNavigation fallback initialized');
        this.currentPage = 'home';
        this.isDashboardMode = false;
    }
    
    init() {
        console.log('EventooNavigation fallback init');
    }
};

window.MonetizationDashboard = window.MonetizationDashboard || class {
    constructor() {
        console.warn('⚠️ MonetizationDashboard fallback initialized');
        this.currentSection = 'overview';
        this.plans = new Map();
        this.challenges = new Map();
        this.activities = [];
    }
    
    init() {
        console.log('MonetizationDashboard fallback init');
    }
};

window.EventooApp = window.EventooApp || class {
    constructor() {
        console.warn('⚠️ EventooApp fallback initialized');
        this.version = '1.0.0-fallback';
        this.isInitialized = true;
    }
    
    init() {
        console.log('EventooApp fallback init');
    }
};

// Inicializar el loader cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.eventooLoader = new EventooLoader();
    });
} else {
    // DOM ya está listo
    window.eventooLoader = new EventooLoader();
}

// Hacer disponible globalmente
window.EventooLoader = EventooLoader;