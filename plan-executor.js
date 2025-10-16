// Plan Executor - Sistema de ejecución de planes de monetización gamificados
// Gestión automática de retos, progreso y notificaciones

class PlanExecutor {
    constructor() {
        this.activePlans = new Map();
        this.currentChallenges = new Map();
        this.completedChallenges = new Map();
        this.notifications = [];
        this.marketingCampaigns = new Map();
        
        this.init();
    }
    
    init() {
        this.loadActivePlans();
        this.startExecutionEngine();
        this.bindRealTimeUpdates();
    }
    
    // Activar un plan de monetización
    async activatePlan(plan) {
        try {
            // Validar plan
            if (!this.validatePlan(plan)) {
                throw new Error('Plan inválido o incompleto');
            }
            
            // Preparar plan para ejecución
            const executionPlan = this.prepareExecutionPlan(plan);
            
            // Almacenar plan activo
            this.activePlans.set(plan.id, executionPlan);
            
            // Inicializar retos
            await this.initializeChallenges(executionPlan);
            
            // Configurar campañas de marketing
            this.setupMarketingCampaigns(executionPlan);
            
            // Notificar activación
            this.notifyPlanActivation(executionPlan);
            
            // Registrar inicio en actividades
            this.logActivity('plan_activated', `Plan ${plan.travelName} activado exitosamente`, plan.id);
            
            return {
                success: true,
                planId: plan.id,
                message: 'Plan activado exitosamente',
                nextChallenge: this.getNextChallenge(plan.id)
            };
            
        } catch (error) {
            console.error('Error activating plan:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    validatePlan(plan) {
        const requiredFields = ['id', 'travelName', 'totalBudget', 'timeFrame', 'challenges'];
        return requiredFields.every(field => plan[field] !== undefined && plan[field] !== null);
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
    
    async initializeChallenges(executionPlan) {
        const challenges = executionPlan.challenges.map((challenge, index) => ({
            ...challenge,
            executionId: `${executionPlan.id}_challenge_${index + 1}`,
            status: 'scheduled',
            scheduledDate: this.calculateChallengeDate(challenge, executionPlan),
            actualStartDate: null,
            actualEndDate: null,
            participants: [],
            results: {},
            marketingCampaign: null
        }));
        
        // Programar primer reto
        if (challenges.length > 0) {
            challenges[0].status = 'ready';
            challenges[0].readyDate = new Date();
        }
        
        this.currentChallenges.set(executionPlan.id, challenges);
        
        // Notificar primer reto listo
        if (challenges.length > 0) {
            this.notifyChallengeReady(challenges[0], executionPlan);
        }
    }
    
    calculateChallengeDate(challenge, plan) {
        const baseDate = new Date(plan.activatedAt);
        const weeksOffset = challenge.week - 1;
        const challengeDate = new Date(baseDate.getTime() + (weeksOffset * 7 * 24 * 60 * 60 * 1000));
        
        // Añadir desfase dentro de la semana (días aleatorios para distribuir)
        const dayOffset = Math.floor(Math.random() * 3) + 1; // 1-3 días de la semana
        challengeDate.setDate(challengeDate.getDate() + dayOffset);
        
        return challengeDate;
    }
    
    setupMarketingCampaigns(executionPlan) {
        const campaignId = `campaign_${executionPlan.id}`;
        const campaign = {
            id: campaignId,
            planId: executionPlan.id,
            name: `Campaña ${executionPlan.travelName}`,
            status: 'active',
            startDate: new Date(),
            budget: Math.round(executionPlan.totalBudget * 0.05), // 5% para marketing
            channels: ['social', 'email', 'web'],
            content: this.generateMarketingContent(executionPlan),
            metrics: {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                revenue: 0
            }
        };
        
        this.marketingCampaigns.set(campaignId, campaign);
        
        // Activar campaña inicial
        this.launchMarketingCampaign(campaign);
    }
    
    generateMarketingContent(executionPlan) {
        return {
            heroText: `¡Únete a la aventura de ${executionPlan.travelName}!`,
            description: `Ayúdanos a recaudar fondos para el viaje más épico del año`,
            callToAction: 'Participa en nuestros retos y gana recompensas exclusivas',
            hashtags: ['#ViajeDeFinDeCurso', '#EventooMagia', '#RetosSolidarios'],
            images: [
                `https://eventoo.com/campaigns/${executionPlan.id}/hero.jpg`,
                `https://eventoo.com/campaigns/${executionPlan.id}/challenges.jpg`
            ]
        };
    }
    
    // Motor de ejecución principal
    startExecutionEngine() {
        // Verificar retos cada hora
        setInterval(() => {
            this.checkChallengesStatus();
        }, 60 * 60 * 1000);
        
        // Actualizar progreso cada 30 minutos
        setInterval(() => {
            this.updatePlansProgress();
        }, 30 * 60 * 1000);
        
        // Monitorear campañas cada 2 horas
        setInterval(() => {
            this.monitorMarketingCampaigns();
        }, 2 * 60 * 60 * 1000);
    }
    
    checkChallengesStatus() {
        this.activePlans.forEach((executionPlan, planId) => {
            const challenges = this.currentChallenges.get(planId);
            if (!challenges) return;
            
            const now = new Date();
            
            challenges.forEach(challenge => {
                switch (challenge.status) {
                    case 'scheduled':
                        if (now >= challenge.scheduledDate) {
                            this.activateChallenge(challenge, executionPlan);
                        }
                        break;
                        
                    case 'active':
                        if (now >= challenge.deadline) {
                            this.completeChallenge(challenge, executionPlan);
                        }
                        break;
                        
                    case 'ready':
                        // Auto-start after 24 hours if not manually started
                        if (now >= new Date(challenge.readyDate.getTime() + 24 * 60 * 60 * 1000)) {
                            this.startChallenge(challenge, executionPlan);
                        }
                        break;
                }
            });
        });
    }
    
    activateChallenge(challenge, plan) {
        challenge.status = 'ready';
        challenge.readyDate = new Date();
        
        this.notifyChallengeReady(challenge, plan);
        this.logActivity('challenge_ready', `Reto "${challenge.title}" está listo para comenzar`, plan.id);
    }
    
    startChallenge(challenge, plan) {
        challenge.status = 'active';
        challenge.actualStartDate = new Date();
        challenge.participants = this.generateParticipants(challenge, plan);
        
        this.notifyChallengeStarted(challenge, plan);
        this.logActivity('challenge_started', `Reto "${challenge.title}" ha comenzado`, plan.id);
        
        // Actualizar campaña de marketing
        this.updateCampaignForChallenge(challenge, plan);
    }
    
    completeChallenge(challenge, plan) {
        challenge.status = 'completed';
        challenge.actualEndDate = new Date();
        
        // Calcular resultado del reto
        const result = this.calculateChallengeResult(challenge, plan);
        challenge.results = result;
        
        // Actualizar plan
        plan.totalRaised += result.revenue;
        plan.completedChallenges = (plan.completedChallenges || 0) + 1;
        
        this.notifyChallengeCompleted(challenge, plan, result);
        this.logActivity('challenge_completed', `Reto "${challenge.title}" completado: €${result.revenue} recaudados`, plan.id);
        
        // Programar siguiente reto
        this.scheduleNextChallenge(plan);
        
        // Actualizar progreso general
        this.updatePlanProgress(plan);
    }
    
    calculateChallengeResult(challenge, plan) {
        const baseRevenue = challenge.targetAmount || challenge.estimatedRevenue;
        const successRate = this.getSuccessRate(challenge.difficulty, plan);
        const effortMultiplier = this.calculateEffortMultiplier(challenge.participants.length);
        
        const revenue = Math.round(baseRevenue * successRate * effortMultiplier);
        const participants = challenge.participants.length;
        const success = revenue >= (baseRevenue * 0.8); // 80% como mínimo para éxito
        
        return {
            revenue,
            participants,
            success,
            efficiency: Math.round((revenue / baseRevenue) * 100),
            timestamp: new Date()
        };
    }
    
    getSuccessRate(difficulty, plan) {
        const baseRates = {
            'Fácil': 0.9,
            'Medio': 0.75,
            'Difícil': 0.6,
            'Experto': 0.45
        };
        
        let rate = baseRates[difficulty] || 0.75;
        
        // Ajustar según progreso general del plan
        if (plan.progress > 75) rate += 0.1; // Bonus por momentum
        if (plan.progress < 25) rate -= 0.1; // Penalización por bajo progreso
        
        return Math.max(0.3, Math.min(0.95, rate));
    }
    
    calculateEffortMultiplier(participantCount) {
        // Más participantes = mejor resultado, con rendimientos decrecientes
        if (participantCount <= 5) return 0.8;
        if (participantCount <= 10) return 1.0;
        if (participantCount <= 20) return 1.2;
        if (participantCount <= 30) return 1.3;
        return 1.35; // Máximo
    }
    
    generateParticipants(challenge, plan) {
        const baseParticipants = Math.min(challenge.participants || 10, plan.numPeople);
        const engagementRate = 0.7; // 70% de participación efectiva
        
        return Array.from({ length: Math.floor(baseParticipants * engagementRate) }, (_, i) => ({
            id: `participant_${i + 1}`,
            name: `Participante ${i + 1}`,
            engagementLevel: Math.random(),
            contribution: Math.random() * 100 + 50 // 50-150€ contribución promedio
        }));
    }
    
    scheduleNextChallenge(plan) {
        const challenges = this.currentChallenges.get(plan.id);
        if (!challenges) return;
        
        const currentIndex = challenges.findIndex(c => c.status === 'completed');
        if (currentIndex >= 0 && currentIndex < challenges.length - 1) {
            const nextChallenge = challenges[currentIndex + 1];
            nextChallenge.status = 'ready';
            nextChallenge.readyDate = new Date();
            
            this.notifyChallengeReady(nextChallenge, plan);
        }
    }
    
    updatePlanProgress(plan) {
        const oldProgress = plan.progress;
        plan.progress = Math.round((plan.totalRaised / plan.totalBudget) * 100);
        plan.lastUpdate = new Date();
        
        // Verificar hitos
        this.checkMilestones(plan, oldProgress);
        
        // Verificar si el plan está completo
        if (plan.progress >= 100) {
            this.completePlan(plan);
        }
    }
    
    checkMilestones(plan, oldProgress) {
        if (!plan.milestones) return;
        
        plan.milestones.forEach(milestone => {
            if (!milestone.unlocked && plan.progress >= milestone.percentage && oldProgress < milestone.percentage) {
                milestone.unlocked = true;
                milestone.unlockedAt = new Date();
                
                this.notifyMilestoneReached(milestone, plan);
                this.logActivity('milestone_reached', `Hito alcanzado: ${milestone.title}`, plan.id);
                
                // Activar campaña de marketing para el hito
                this.launchMilestoneCampaign(milestone, plan);
            }
        });
    }
    
    completePlan(plan) {
        plan.status = 'completed';
        plan.completedAt = new Date();
        
        // Completar todos los retos pendientes
        const challenges = this.currentChallenges.get(plan.id);
        if (challenges) {
            challenges.forEach(challenge => {
                if (challenge.status === 'active' || challenge.status === 'ready') {
                    challenge.status = 'completed';
                    challenge.actualEndDate = new Date();
                }
            });
        }
        
        this.notifyPlanCompleted(plan);
        this.logActivity('plan_completed', `Plan ${plan.travelName} completado exitosamente`, plan.id);
        
        // Lanzar campaña final de celebración
        this.launchCompletionCampaign(plan);
        
        // Generar reporte final
        this.generateFinalReport(plan);
    }
    
    // Sistema de notificaciones
    notifyPlanActivation(plan) {
        this.addNotification({
            type: 'success',
            title: '¡Plan Activado!',
            message: `El plan "${plan.travelName}" ha sido activado exitosamente. El primer reto está listo para comenzar.`,
            planId: plan.id,
            timestamp: new Date()
        });
    }
    
    notifyChallengeReady(challenge, plan) {
        this.addNotification({
            type: 'info',
            title: 'Reto Listo',
            message: `El reto "${challenge.title}" está listo para comenzar. ¡Prepárate para la acción!`,
            planId: plan.id,
            challengeId: challenge.id,
            timestamp: new Date()
        });
    }
    
    notifyChallengeStarted(challenge, plan) {
        this.addNotification({
            type: 'success',
            title: '¡Reto Iniciado!',
            message: `El reto "${challenge.title}" ha comenzado. ¡Demuestra tu magia!`,
            planId: plan.id,
            challengeId: challenge.id,
            timestamp: new Date()
        });
    }
    
    notifyChallengeCompleted(challenge, plan, result) {
        const message = result.success 
            ? `¡Excelente! El reto "${challenge.title}" se completó con éxito, recaudando €${result.revenue}`
            : `El reto "${challenge.title}" se completó con €${result.revenue}. ¡Sigue adelante!`;
            
        this.addNotification({
            type: result.success ? 'success' : 'warning',
            title: 'Reto Completado',
            message: message,
            planId: plan.id,
            challengeId: challenge.id,
            timestamp: new Date()
        });
    }
    
    notifyMilestoneReached(milestone, plan) {
        this.addNotification({
            type: 'success',
            title: '🏆 Hito Alcanzado!',
            message: `¡Felicidades! Has alcanzado el ${milestone.percentage}% del objetivo. ${milestone.reward}`,
            planId: plan.id,
            milestoneId: milestone.percentage,
            timestamp: new Date()
        });
    }
    
    notifyPlanCompleted(plan) {
        this.addNotification({
            type: 'success',
            title: '🎉 ¡Viaje Financiado!',
            message: `¡INCREÍBLE! Has completado el objetivo para ${plan.travelName}. ¡El viaje está garantido!`,
            planId: plan.id,
            timestamp: new Date()
        });
    }
    
    // Sistema de campañas de marketing
    launchMarketingCampaign(campaign) {
        console.log(`🚀 Lanzando campaña: ${campaign.name}`);
        
        // Simular lanzamiento de campaña
        setTimeout(() => {
            campaign.status = 'active';
            campaign.launchedAt = new Date();
            
            // Simular métricas iniciales
            campaign.metrics.impressions = Math.floor(Math.random() * 1000) + 500;
            campaign.metrics.clicks = Math.floor(campaign.metrics.impressions * 0.1);
            
            this.logActivity('campaign_launched', `Campaña de marketing lanzada: ${campaign.name}`, campaign.planId);
        }, 2000);
    }
    
    launchMilestoneCampaign(milestone, plan) {
        const campaign = this.marketingCampaigns.get(`campaign_${plan.id}`);
        if (!campaign) return;
        
        const milestoneCampaign = {
            ...campaign,
            id: `${campaign.id}_milestone_${milestone.percentage}`,
            content: {
                ...campaign.content,
                heroText: `🏆 ¡Hito Alcanzado! ${milestone.percentage}% del objetivo para ${plan.travelName}`,
                description: `Hemos alcanzado el ${milestone.percentage}% de nuestro objetivo. ¡Únete a la celebración!`
            },
            budget: campaign.budget * 0.2 // 20% del presupuesto para hito
        };
        
        this.launchMarketingCampaign(milestoneCampaign);
    }
    
    launchCompletionCampaign(plan) {
        const campaign = this.marketingCampaigns.get(`campaign_${plan.id}`);
        if (!campaign) return;
        
        const completionCampaign = {
            ...campaign,
            id: `${campaign.id}_completion`,
            content: {
                ...campaign.content,
                heroText: `🎉 ¡OBJETIVO COMPLETADO! Viaje a ${plan.destination} financiado`,
                description: '¡Gracias a todos por hacer posible este sueño! ¡Nos vemos en el viaje!'
            },
            budget: campaign.budget * 0.5 // 50% del presupuesto para celebración final
        };
        
        this.launchMarketingCampaign(completionCampaign);
    }
    
    updateCampaignForChallenge(challenge, plan) {
        const campaign = this.marketingCampaigns.get(`campaign_${plan.id}`);
        if (!campaign) return;
        
        // Actualizar contenido para el reto actual
        campaign.currentChallenge = {
            id: challenge.id,
            title: challenge.title,
            deadline: challenge.deadline,
            progress: challenge.progress || 0
        };
        
        campaign.content.currentChallenge = `Reto activo: ${challenge.title}`;
        campaign.content.callToAction = `¡Únete al reto "${challenge.title}" y ayúdanos a alcanzar nuestro objetivo!`;
    }
    
    monitorMarketingCampaigns() {
        this.marketingCampaigns.forEach((campaign, campaignId) => {
            if (campaign.status === 'active') {
                // Simular actualización de métricas
                campaign.metrics.impressions += Math.floor(Math.random() * 100);
                campaign.metrics.clicks += Math.floor(Math.random() * 10);
                campaign.metrics.conversions += Math.floor(Math.random() * 2);
                
                // Actualizar ROI
                const estimatedRevenue = campaign.metrics.conversions * 25; // 25€ promedio por conversión
                campaign.metrics.revenue = estimatedRevenue;
                campaign.metrics.roi = estimatedRevenue / campaign.budget;
            }
        });
    }
    
    // Utilidades y helpers
    addNotification(notification) {
        this.notifications.unshift({
            id: Date.now() + Math.random(),
            ...notification,
            read: false
        });
        
        // Mantener solo las últimas 50 notificaciones
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
    }
    
    logActivity(type, message, planId = null) {
        const activity = {
            id: Date.now() + Math.random(),
            type,
            message,
            planId,
            timestamp: new Date()
        };
        
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Aquí podrías guardar en base de datos o enviar a analytics
        // Por ahora solo logueamos
    }
    
    generateFinalReport(plan) {
        const report = {
            planId: plan.id,
            planName: plan.travelName,
            totalBudget: plan.totalBudget,
            totalRaised: plan.totalRaised,
            progress: plan.progress,
            startDate: plan.activatedAt,
            endDate: plan.completedAt,
            duration: Math.ceil((plan.completedAt - plan.activatedAt) / (1000 * 60 * 60 * 24)),
            challenges: this.getPlanChallengesSummary(plan.id),
            milestones: plan.milestones.filter(m => m.unlocked),
            marketingMetrics: this.getMarketingMetrics(plan.id),
            efficiency: Math.round((plan.totalRaised / plan.totalBudget) * 100),
            status: 'completed'
        };
        
        this.logActivity('report_generated', `Reporte final generado para ${plan.travelName}`, plan.id);
        
        return report;
    }
    
    getPlanChallengesSummary(planId) {
        const challenges = this.currentChallenges.get(planId) || [];
        return {
            total: challenges.length,
            completed: challenges.filter(c => c.status === 'completed').length,
            active: challenges.filter(c => c.status === 'active').length,
            totalRevenue: challenges
                .filter(c => c.status === 'completed' && c.results)
                .reduce((sum, c) => sum + c.results.revenue, 0)
        };
    }
    
    getMarketingMetrics(planId) {
        const campaign = this.marketingCampaigns.get(`campaign_${planId}`);
        if (!campaign) return null;
        
        return {
            impressions: campaign.metrics.impressions,
            clicks: campaign.metrics.clicks,
            conversions: campaign.metrics.conversions,
            revenue: campaign.metrics.revenue,
            roi: campaign.metrics.roi,
            budget: campaign.budget
        };
    }
    
    getNextChallenge(planId) {
        const challenges = this.currentChallenges.get(planId);
        if (!challenges) return null;
        
        return challenges.find(c => c.status === 'ready') || 
               challenges.find(c => c.status === 'scheduled') ||
               null;
    }
    
    // Métodos de carga y persistencia
    loadActivePlans() {
        // En una implementación real, esto cargaría desde una base de datos
        // Por ahora, simulamos que no hay planes activos al inicio
        this.activePlans.clear();
    }
    
    bindRealTimeUpdates() {
        // Conectar con el sistema de actualización en tiempo real
        // Esto permitiría actualizaciones push desde el servidor
    }
    
    // Métodos públicos para la interfaz
    getActivePlans() {
        return Array.from(this.activePlans.values());
    }
    
    getPlanDetails(planId) {
        const plan = this.activePlans.get(planId);
        if (!plan) return null;
        
        const challenges = this.currentChallenges.get(planId) || [];
        const campaign = this.marketingCampaigns.get(`campaign_${planId}`);
        
        return {
            ...plan,
            challenges,
            marketingCampaign: campaign,
            nextChallenge: this.getNextChallenge(planId)
        };
    }
    
    getNotifications(limit = 10) {
        return this.notifications.slice(0, limit);
    }
    
    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    }
}

// Instancia global del ejecutor de planes
window.planExecutor = new PlanExecutor();