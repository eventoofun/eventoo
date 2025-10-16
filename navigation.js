// Sistema de Navegación y Gestión de la Web Eventoo
// Controlador principal para la navegación y funcionalidades de la web

class EventooNavigation {
    constructor() {
        this.currentPage = 'home';
        this.isDashboardMode = false;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializePage();
        this.setupMobileMenu();
        this.initializeScrollEffects();
    }
    
    bindEvents() {
        // Navegación suave
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleSmoothScroll(e);
            });
        });
        
        // Botones de navegación del dashboard
        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                this.navigateToDashboard();
            });
        }
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    initializePage() {
        // Detectar página actual
        const path = window.location.pathname;
        if (path.includes('monetization-dashboard')) {
            this.currentPage = 'dashboard';
            this.isDashboardMode = true;
        } else if (path.includes('test-integration')) {
            this.currentPage = 'test';
        } else {
            this.currentPage = 'home';
        }
        
        // Actualizar navegación activa
        this.updateActiveNavigation();
        
        // Inicializar efectos de página específicos
        if (this.currentPage === 'home') {
            this.initializeHomeEffects();
        }
    }
    
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Ajustar por navbar fijo
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Actualizar URL sin recargar
            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        }
    }
    
    navigateToDashboard() {
        // Animación de transición
        this.showTransitionEffect(() => {
            window.location.href = 'monetization-dashboard.html';
        });
    }
    
    navigateToHome() {
        if (this.currentPage !== 'home') {
            window.location.href = 'index.html';
        }
    }
    
    navigateToTest() {
        window.location.href = 'test-integration.html';
    }
    
    updateActiveNavigation() {
        // Limpiar navegación activa
        document.querySelectorAll('.nav-link, .nav-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Activar navegación según página
        if (this.currentPage === 'dashboard') {
            const dashboardLinks = document.querySelectorAll('[data-section]');
            dashboardLinks.forEach(link => {
                if (link.dataset.section === 'overview') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    }
    
    initializeScrollEffects() {
        // Parallax effect para estrellas
        const stars = document.querySelector('.stars');
        if (stars) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                stars.style.transform = `translateY(${scrolled * 0.5}px)`;
            });
        }
        
        // Animaciones de scroll para elementos
        this.setupScrollAnimations();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observar elementos para animación
        const animatedElements = document.querySelectorAll('.magic-card, .slide-in-up');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    initializeHomeEffects() {
        // Efectos específicos para la página home
        this.initializeTypewriter();
        this.initializeParticleEffects();
    }
    
    initializeTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        if (typewriterElement) {
            // Reset animation
            typewriterElement.style.animation = 'none';
            typewriterElement.offsetHeight; // Trigger reflow
            typewriterElement.style.animation = null;
        }
    }
    
    initializeParticleEffects() {
        // Animación de partículas mágicas
        const particles = document.querySelectorAll('.magic-particle');
        particles.forEach((particle, index) => {
            particle.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    handleScroll() {
        const navbar = document.querySelector('nav');
        const scrolled = window.pageYOffset;
        
        // Efecto de navbar al hacer scroll
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Actualizar navegación activa basada en scroll
        this.updateActiveSectionOnScroll();
    }
    
    updateActiveSectionOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Actualizar navegación activa
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    handleResize() {
        // Manejar cambios de tamaño de ventana
        if (window.innerWidth > 768) {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        }
    }
    
    showTransitionEffect(callback) {
        // Crear overlay de transición
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        overlay.innerHTML = `
            <div class="text-center text-white">
                <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-xl">Cargando magia...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            if (callback) callback();
            document.body.removeChild(overlay);
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
    
    // Métodos de utilidad
    getCurrentPage() {
        return this.currentPage;
    }
    
    isOnDashboard() {
        return this.isDashboardMode;
    }
    
    // Métodos para el dashboard
    navigateToDashboardSection(section) {
        if (window.dashboard) {
            window.dashboard.loadSection(section);
        }
    }
    
    // Métodos específicos para la página de inicio
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Métodos para testing
    runDiagnostics() {
        const diagnostics = {
            currentPage: this.currentPage,
            isDashboardMode: this.isDashboardMode,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            scrollPosition: window.pageYOffset,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        console.log('🔍 Eventoo Navigation Diagnostics:', diagnostics);
        return diagnostics;
    }
}

// Inicializar navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.eventooNavigation = new EventooNavigation();
    
    // Agregar estilos CSS adicionales
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
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
        
        nav.scrolled {
            background: rgba(15, 23, 42, 0.95) !important;
            backdrop-filter: blur(20px);
        }
        
        .nav-link.active {
            color: #667eea;
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🧭 Eventoo Navigation System initialized successfully');
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventooNavigation;
}