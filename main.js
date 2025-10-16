// Eventoo Main Application
// Controlador principal que integra todos los componentes de la aplicación

class EventooApp {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        this.version = '1.0.0';
        this.init();
    }
    
    init() {
        try {
            this.initializeCore();
            this.initializeComponents();
            this.bindGlobalEvents();
            this.showWelcomeMessage();
            this.isInitialized = true;
            
            console.log(`✨ Eventoo App v${this.version} initialized successfully`);
        } catch (error) {
            console.error('❌ Error initializing Eventoo App:', error);
            this.handleInitializationError(error);
        }
    }
    
    initializeCore() {
        // Verificar dependencias necesarias
        this.checkDependencies();
        
        // Configurar entorno
        this.setupEnvironment();
        
        // Inicializar sistema de logging
        this.initializeLogging();
    }
    
    checkDependencies() {
        const requiredDependencies = [
            'EventooNavigation',
            'MonetizationDashboard',
            'MonetizationPlanner',
            'PlanExecutor'
        ];
        
        const missingDeps = requiredDependencies.filter(dep => 
            typeof window[dep] === 'undefined'
        );
        
        if (missingDeps.length > 0) {
            throw new Error(`Missing dependencies: ${missingDeps.join(', ')}`);
        }
        
        console.log('✅ All dependencies loaded successfully');
    }
    
    setupEnvironment() {
        // Configurar variables de entorno
        this.environment = {
            isProduction: window.location.hostname !== 'localhost',
            isDevelopment: window.location.hostname === 'localhost',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            version: this.version
        };
        
        // Configurar modo debug
        window.DEBUG_MODE = this.environment.isDevelopment;
        
        console.log('🌍 Environment configured:', this.environment);
    }
    
    initializeLogging() {
        // Sistema de logging mejorado
        this.logger = {
            info: (message, data = null) => {
                console.log(`ℹ️  ${message}`, data || '');
            },
            
            success: (message, data = null) => {
                console.log(`✅ ${message}`, data || '');
            },
            
            warning: (message, data = null) => {
                console.warn(`⚠️  ${message}`, data || '');
            },
            
            error: (message, data = null) => {
                console.error(`❌ ${message}`, data || '');
            },
            
            debug: (message, data = null) => {
                if (window.DEBUG_MODE) {
                    console.log(`🐛 ${message}`, data || '');
                }
            }
        };
    }
    
    initializeComponents() {
        // Inicializar navegación
        if (window.eventooNavigation) {
            this.components.set('navigation', window.eventooNavigation);
            this.logger.success('Navigation component initialized');
        }
        
        // Inicializar dashboard si está disponible
        if (window.dashboard) {
            this.components.set('dashboard', window.dashboard);
            this.logger.success('Dashboard component initialized');
        }
        
        // Inicializar otros componentes según la página
        this.initializePageSpecificComponents();
    }
    
    initializePageSpecificComponents() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'home':
                this.initializeHomeComponents();
                break;
            case 'dashboard':
                this.initializeDashboardComponents();
                break;
            case 'test':
                this.initializeTestComponents();
                break;
            default:
                this.logger.info('No specific components for current page');
        }
    }
    
    initializeHomeComponents() {
        // Componentes específicos para la página de inicio
        this.initializeHeroEffects();
        this.initializeFeatureCards();
        this.initializePricingCards();
        
        this.logger.success('Home page components initialized');
    }
    
    initializeDashboardComponents() {
        // Componentes específicos para el dashboard
        if (window.dashboard) {
            // El dashboard ya está inicializado por su propio script
            this.logger.success('Dashboard components already initialized');
        }
    }
    
    initializeTestComponents() {
        // Componentes específicos para la página de pruebas
        this.logger.info('Test page components initialized');
    }
    
    initializeHeroEffects() {
        // Efectos para la sección hero
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            // Animación de entrada
            setTimeout(() => {
                heroSection.classList.add('hero-animated');
            }, 500);
        }
        
        this.logger.info('Hero effects initialized');
    }
    
    initializeFeatureCards() {
        // Animaciones para las tarjetas de características
        const featureCards = document.querySelectorAll('.magic-card');
        
        featureCards.forEach((card, index) => {
            // Añadir delay de animación escalonado
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Añadir eventos de hover mejorados
            card.addEventListener('mouseenter', () => {
                this.onFeatureCardHover(card, index);
            });
            
            card.addEventListener('mouseleave', () => {
                this.onFeatureCardLeave(card, index);
            });
        });
        
        this.logger.info(`Feature cards initialized: ${featureCards.length} cards`);
    }
    
    initializePricingCards() {
        // Animaciones para las tarjetas de precios
        const pricingCards = document.querySelectorAll('#pricing .magic-card');
        
        pricingCards.forEach((card, index) => {
            // Añadir efectos de hover especiales para precios
            card.addEventListener('mouseenter', () => {
                this.onPricingCardHover(card, index);
            });
            
            card.addEventListener('mouseleave', () => {
                this.onPricingCardLeave(card, index);
            });
        });
        
        this.logger.info(`Pricing cards initialized: ${pricingCards.length} cards`);
    }
    
    onFeatureCardHover(card, index) {
        // Efectos específicos al hacer hover en tarjetas de características
        card.style.transform = 'translateY(-15px) scale(1.02)';
        
        // Añadir brillo
        if (!card.querySelector('.card-glow')) {
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            glow.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, #667eea, #764ba2, #f59e0b);
                border-radius: inherit;
                z-index: -1;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            card.style.position = 'relative';
            card.appendChild(glow);
        }
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.opacity = '0.3';
        }
    }
    
    onFeatureCardLeave(card, index) {
        // Restaurar estado al dejar de hacer hover
        card.style.transform = '';
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.opacity = '0';
        }
    }
    
    onPricingCardHover(card, index) {
        // Efectos específicos para tarjetas de precios
        if (index === 1) { // Plan más popular
            card.style.transform = 'translateY(-20px) scale(1.05)';
        } else {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }
    }
    
    onPricingCardLeave(card, index) {
        // Restaurar estado
        card.style.transform = '';
    }
    
    bindGlobalEvents() {
        // Eventos globales de la aplicación
        window.addEventListener('beforeunload', () => {
            this.onBeforeUnload();
        });
        
        window.addEventListener('error', (event) => {
            this.onGlobalError(event);
        });
        
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Atajos de teclado
        document.addEventListener('keydown', (event) => {
            this.onKeyDown(event);
        });
    }
    
    onBeforeUnload() {
        this.logger.info('Application unloading...');
        // Guardar estado si es necesario
        this.saveApplicationState();
    }
    
    onGlobalError(event) {
        this.logger.error('Global error captured:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
        
        // Mostrar mensaje al usuario si es en producción
        if (this.environment.isProduction) {
            this.showUserError('Ha ocurrido un error. Por favor, recarga la página.');
        }
    }
    
    onWindowResize() {
        // Manejar cambios de tamaño de ventana
        this.logger.debug('Window resized:', {
            width: window.innerWidth,
            height: window.innerHeight
        });
        
        // Notificar a componentes si es necesario
        this.components.forEach(component => {
            if (typeof component.onResize === 'function') {
                component.onResize();
            }
        });
    }
    
    onKeyDown(event) {
        // Atajos de teclado
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'k':
                    event.preventDefault();
                    this.openSearch();
                    break;
                case 'd':
                    event.preventDefault();
                    this.navigateToDashboard();
                    break;
            }
        }
        
        // Escape para cerrar modales
        if (event.key === 'Escape') {
            this.closeModals();
        }
    }
    
    showWelcomeMessage() {
        const currentPage = this.getCurrentPage();
        const messages = {
            home: '🎉 Bienvenido a Eventoo Cognitive - La plataforma mágica donde los deseos se hacen realidad',
            dashboard: '📊 Dashboard de Monetización cargado exitosamente',
            test: '🧪 Modo de pruebas activado'
        };
        
        setTimeout(() => {
            this.showNotification(messages[currentPage] || 'Eventoo App initialized', 'success');
        }, 1000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg text-white z-50 max-w-sm ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 
            type === 'warning' ? 'bg-yellow-600' :
            'bg-blue-600'
        }`;
        notification.textContent = message;
        notification.style.animation = 'slideIn 0.3s ease-out';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    showUserError(message) {
        // Mostrar error amigable al usuario
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        errorDiv.innerHTML = `
            <div class="bg-white p-6 rounded-lg max-w-md mx-4">
                <h3 class="text-lg font-semibold text-red-600 mb-2">Error</h3>
                <p class="text-gray-700 mb-4">${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Cerrar
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    handleInitializationError(error) {
        console.error('Failed to initialize Eventoo App:', error);
        
        // Mostrar mensaje de error al usuario
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-red-600 bg-opacity-90 flex items-center justify-center z-50';
        errorDiv.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-lg mx-4 text-center">
                <h2 class="text-2xl font-bold text-red-600 mb-4">Error de Inicialización</h2>
                <p class="text-gray-700 mb-4">No se pudo inicializar la aplicación correctamente.</p>
                <p class="text-sm text-gray-500 mb-6">${error.message}</p>
                <button onclick="location.reload()" 
                        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Recargar Aplicación
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    saveApplicationState() {
        // Guardar estado de la aplicación si es necesario
        const state = {
            currentPage: this.currentPage,
            timestamp: new Date().toISOString(),
            version: this.version
        };
        
        try {
            localStorage.setItem('eventoo_app_state', JSON.stringify(state));
        } catch (error) {
            this.logger.warning('Could not save application state:', error);
        }
    }
    
    loadApplicationState() {
        try {
            const state = localStorage.getItem('eventoo_app_state');
            return state ? JSON.parse(state) : null;
        } catch (error) {
            this.logger.warning('Could not load application state:', error);
            return null;
        }
    }
    
    // Métodos de utilidad
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('monetization-dashboard')) return 'dashboard';
        if (path.includes('test-integration')) return 'test';
        return 'home';
    }
    
    getComponent(name) {
        return this.components.get(name);
    }
    
    getVersion() {
        return this.version;
    }
    
    isReady() {
        return this.isInitialized;
    }
    
    // Métodos de atajos
    navigateToDashboard() {
        if (this.getCurrentPage() !== 'dashboard') {
            window.location.href = 'monetization-dashboard.html';
        }
    }
    
    navigateToHome() {
        if (this.getCurrentPage() !== 'home') {
            window.location.href = 'index.html';
        }
    }
    
    navigateToTest() {
        if (this.getCurrentPage() !== 'test') {
            window.location.href = 'test-integration.html';
        }
    }
    
    openSearch() {
        // Implementar búsqueda global
        this.showNotification('Función de búsqueda próximamente disponible', 'info');
    }
    
    closeModals() {
        // Cerrar todos los modales abiertos
        const modals = document.querySelectorAll('.modal, .overlay');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }
    
    // Métodos de diagnóstico
    runDiagnostics() {
        const diagnostics = {
            version: this.version,
            currentPage: this.getCurrentPage(),
            components: Array.from(this.components.keys()),
            environment: this.environment,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            windowSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            isInitialized: this.isInitialized
        };
        
        this.logger.info('Running diagnostics...', diagnostics);
        return diagnostics;
    }
    
    // Método para obtener estadísticas
    getStats() {
        return {
            version: this.version,
            components: this.components.size,
            currentPage: this.getCurrentPage(),
            isInitialized: this.isInitialized,
            timestamp: new Date().toISOString()
        };
    }
}

// Inicializar aplicación principal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.eventooApp = new EventooApp();
        
        // Agregar estilos CSS globales
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(10px);
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(102, 126, 234, 0.3);
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .hero-animated {
                animation: heroFadeIn 1s ease-out;
            }
            
            @keyframes heroFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log('🚀 Eventoo Main Application initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize Eventoo Main Application:', error);
    }
});

// Hacer disponible globalmente
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventooApp;
}

// Atajos globales para desarrollo
window.Eventoo = {
    app: null,
    navigation: null,
    dashboard: null,
    
    init() {
        this.app = window.eventooApp;
        this.navigation = window.eventooNavigation;
        this.dashboard = window.dashboard;
    },
    
    diagnostics() {
        if (this.app) {
            return this.app.runDiagnostics();
        }
        return null;
    },
    
    stats() {
        if (this.app) {
            return this.app.getStats();
        }
        return null;
    }
};

// Inicializar atajos después de un breve retraso
setTimeout(() => {
    window.Eventoo.init();
}, 100);