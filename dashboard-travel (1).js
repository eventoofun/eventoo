// Dashboard Casa de Magia - Sistema de gestión integral
// Integración con Travel Planner y control de secciones

class DashboardManager {
    constructor() {
        this.currentSection = 'overview';
        this.notifications = [];
        this.stats = {
            totalRevenue: 12450,
            activeStudents: 156,
            plannedTrips: 8,
            successRate: 94,
            totalCollected: 45670,
            completedTrips: 12,
            satisfaction: 98,
            totalTravelers: 1247
        };
        
        this.travels = [
            {
                id: 1,
                name: 'Barcelona Cultural',
                destination: 'Barcelona, España',
                type: 'cultural',
                status: 'active',
                students: 25,
                collected: 6250,
                target: 8500,
                progress: 73,
                departureDate: '2025-03-15',
                returnDate: '2025-03-18',
                accommodation: 'Hotel 3 estrellas',
                transport: 'Autocar privado'
            },
            {
                id: 2,
                name: 'Aventura Pirineos',
                destination: 'Pirineos, España',
                type: 'adventure',
                status: 'processing',
                students: 18,
                collected: 2100,
                target: 7200,
                progress: 29,
                departureDate: '2025-04-10',
                returnDate: '2025-04-13',
                accommodation: 'Refugio montaña',
                transport: 'Minibus 4x4'
            },
            {
                id: 3,
                name: 'París Artístico',
                destination: 'París, Francia',
                type: 'cultural',
                status: 'completed',
                students: 22,
                collected: 9500,
                target: 9500,
                progress: 100,
                departureDate: '2025-01-20',
                returnDate: '2025-01-23',
                accommodation: 'Hotel 4 estrellas',
                transport: 'Tren AVE'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSection('overview');
        this.startRealTimeUpdates();
        this.showWelcomeMessage();
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
        
        // Quick actions
        const quickActions = document.querySelectorAll('.quick-action button');
        quickActions.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.textContent.trim());
            });
        });
        
        // Travel management buttons
        document.addEventListener('click', (e) => {
            if (e.target.textContent.includes('Ver Detalles')) {
                this.showTravelDetails(e.target);
            }
        });
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
            case 'travel':
                this.loadTravelSection();
                break;
            case 'gamification':
                this.loadGamificationSection();
                break;
            case 'finances':
                this.loadFinancesSection();
                break;
            case 'students':
                this.loadStudentsSection();
                break;
            case 'settings':
                this.loadSettingsSection();
                break;
        }
    }
    
    loadOverview() {
        // Update stats with real-time data
        this.updateStatsCards();
        
        // Animate stats on load
        this.animateStatsCards();
    }
    
    loadTravelSection() {
        // Update travel cards with current data
        this.updateTravelCards();
        
        // Add travel-specific functionality
        this.initializeTravelFeatures();
    }
    
    loadGamificationSection() {
        // Show gamification management interface
        this.showNotification('Sistema de gamificación cargado correctamente', 'info');
    }
    
    loadFinancesSection() {
        // Show financial reports and analytics
        this.showNotification('Módulo financiero en desarrollo', 'info');
    }
    
    loadStudentsSection() {
        // Show student management interface
        this.showNotification('Gestión de estudiantes en desarrollo', 'info');
    }
    
    loadSettingsSection() {
        // Show system settings
        this.showNotification('Configuración del sistema en desarrollo', 'info');
    }
    
    updateStatsCards() {
        // Update stats with current values
        const statsElements = {
            revenue: document.querySelector('[data-stat="revenue"]'),
            students: document.querySelector('[data-stat="students"]'),
            trips: document.querySelector('[data-stat="trips"]'),
            success: document.querySelector('[data-stat="success"]')
        };
        
        Object.keys(statsElements).forEach(key => {
            if (statsElements[key]) {
                const value = this.getStatValue(key);
                statsElements[key].textContent = value;
            }
        });
    }
    
    getStatValue(key) {
        const statMap = {
            revenue: `€${this.stats.totalRevenue.toLocaleString()}`,
            students: this.stats.activeStudents.toString(),
            trips: this.stats.plannedTrips.toString(),
            success: `${this.stats.successRate}%`
        };
        
        return statMap[key] || '0';
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
    
    updateTravelCards() {
        // This would update the travel cards with real data
        // For now, we'll just ensure they're visible
        const travelCards = document.querySelectorAll('#travel .glass');
        travelCards.forEach(card => {
            card.style.opacity = '1';
        });
    }
    
    initializeTravelFeatures() {
        // Add travel-specific event listeners
        const travelSection = document.getElementById('travel');
        
        // Add hover effects to travel cards
        const travelCards = travelSection.querySelectorAll('.glass');
        travelCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    }
    
    handleQuickAction(actionName) {
        switch (actionName) {
            case 'Crear Reto':
                this.showChallengeCreator();
                break;
            case 'Ver Reportes':
                this.showReports();
                break;
            case 'Gestionar':
                this.navigateToSection('students');
                break;
            default:
                this.showNotification(`Acción "${actionName}" en desarrollo`, 'info');
        }
    }
    
    showChallengeCreator() {
        // Create modal for challenge creation
        const modal = this.createModal('Creador de Retos', `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Nombre del Reto</label>
                    <input type="text" class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="Nombre del reto...">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Tipo de Reto</label>
                    <select class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white">
                        <option value="">Selecciona tipo...</option>
                        <option value="cultural">Cultural</option>
                        <option value="adventure">Aventura</option>
                        <option value="ecological">Ecológico</option>
                        <option value="innovation">Innovación</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Meta de Recaudación (€)</label>
                    <input type="number" class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="0">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Fecha Límite</label>
                    <input type="date" class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white">
                </div>
            </div>
        `, [
            { text: 'Cancelar', action: () => this.closeModal(), class: 'bg-gray-600 hover:bg-gray-700' },
            { text: 'Crear Reto', action: () => this.createChallenge(), class: 'bg-blue-500 hover:bg-blue-600' }
        ]);
        
        document.body.appendChild(modal);
    }
    
    showReports() {
        this.showNotification('Generando reportes...', 'info');
        
        // Simulate report generation
        setTimeout(() => {
            this.showNotification('Reportes generados correctamente', 'success');
        }, 2000);
    }
    
    showTravelDetails(button) {
        const travelCard = button.closest('.glass');
        const travelName = travelCard.querySelector('h3').textContent;
        
        this.showNotification(`Mostrando detalles de: ${travelName}`, 'info');
        
        // In a real implementation, this would open a detailed view
        // For now, we'll just show a notification
    }
    
    createChallenge() {
        const modal = document.querySelector('.modal-overlay');
        const inputs = modal.querySelectorAll('input, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('border-red-400');
                isValid = false;
            } else {
                input.classList.remove('border-red-400');
            }
        });
        
        if (isValid) {
            this.closeModal();
            this.showNotification('¡Reto creado exitosamente!', 'success');
            
            // Update stats
            this.stats.activeStudents += 5;
            this.updateStatsCards();
        } else {
            this.showNotification('Por favor completa todos los campos', 'error');
        }
    }
    
    createModal(title, content, buttons) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'glass rounded-2xl p-6 max-w-md w-full mx-4';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex items-center justify-between mb-6';
        modalHeader.innerHTML = `
            <h3 class="text-xl font-bold text-white">${title}</h3>
            <button onclick="dashboard.closeModal()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        `;
        
        const modalBody = document.createElement('div');
        modalBody.className = 'mb-6';
        modalBody.innerHTML = content;
        
        const modalFooter = document.createElement('div');
        modalFooter.className = 'flex gap-3 justify-end';
        
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `px-4 py-2 rounded-lg font-medium text-white transition-colors ${button.class}`;
            btn.textContent = button.text;
            btn.onclick = button.action;
            modalFooter.appendChild(btn);
        });
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        
        return modal;
    }
    
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
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
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateRealTimeData();
        }, 30000);
        
        // Update notifications
        setInterval(() => {
            this.checkForNewNotifications();
        }, 60000);
    }
    
    updateRealTimeData() {
        // Simulate small changes in stats
        const variations = {
            totalRevenue: Math.floor(Math.random() * 100) - 50,
            activeStudents: Math.floor(Math.random() * 5) - 2,
            plannedTrips: Math.floor(Math.random() * 2) - 1,
            successRate: Math.floor(Math.random() * 2) - 1
        };
        
        Object.keys(variations).forEach(key => {
            this.stats[key] = Math.max(0, this.stats[key] + variations[key]);
        });
        
        // Update UI if in overview
        if (this.currentSection === 'overview') {
            this.updateStatsCards();
        }
    }
    
    checkForNewNotifications() {
        // Simulate receiving new notifications
        if (Math.random() > 0.7) {
            const messages = [
                'Nuevo estudiante se ha unido al sistema',
                'Se ha completado un reto de gamificación',
                'Nueva venta en la tienda de colecciones',
                'Actualización disponible en el sistema'
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            this.showNotification(randomMessage, 'info');
        }
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('¡Bienvenido al Dashboard de la Casa de Magia! El Genio Djink está listo para ayudarte.', 'success');
        }, 1000);
    }
    
    // Public method to close modal from global scope
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
}

// Initialize dashboard
let dashboard;

document.addEventListener('DOMContentLoaded', function() {
    dashboard = new DashboardManager();
    
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
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add progress bar animations
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
window.dashboard = dashboard;