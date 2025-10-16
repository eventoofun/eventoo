// Sistema de Monetización Gamificada - Eventoo Cognitive EDU
// Generación automática de planes de recaudación basados en presupuesto y plazo

class MonetizationPlanner {
    constructor() {
        this.plans = new Map();
        this.challengeTemplates = this.initializeChallengeTemplates();
        this.rewardTemplates = this.initializeRewardTemplates();
        this.difficultySettings = this.initializeDifficultySettings();
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
                },
                {
                    title: "Rifa de Experiencias Locales",
                    description: "Sortea experiencias únicas donadas por negocios locales",
                    baseRevenue: 200,
                    difficulty: "Fácil", 
                    timeRequired: 2,
                    resources: ["Contactos con negocios", "Boletos de rifa", "Premios donados"]
                },
                {
                    title: "Maratón de Juegos Solidario",
                    description: "Torneo de juegos de mesa y videojuegos con inscripción",
                    baseRevenue: 180,
                    difficulty: "Fácil",
                    timeRequired: 1,
                    resources: ["Juegos disponibles", "Espacio para evento", "Sistema de puntuación"]
                },
                {
                    title: "Feria de Artesanía Estudiantil",
                    description: "Venta de productos hechos por los propios estudiantes",
                    baseRevenue: 120,
                    difficulty: "Fácil",
                    timeRequired: 4,
                    resources: ["Materiales para crear", "Espacio de venta", "Mostradores"]
                },
                {
                    title: "Tarde de Karaoke Benéfico",
                    description: "Evento de karaoke con entrada y venta de snacks",
                    baseRevenue: 160,
                    difficulty: "Fácil",
                    timeRequired: 1,
                    resources: ["Equipo de sonido", "Micrófonos", "Proyector para letras"]
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
                },
                {
                    title: "Subasta de Objetos Donados",
                    description: "Subasta silenciosa de objetos donados por la comunidad",
                    baseRevenue: 350,
                    difficulty: "Medio",
                    timeRequired: 3,
                    resources: ["Objetos donados", "Sistema de pujas", "Voluntarios organizadores"]
                },
                {
                    title: "Torneo Deportivo Multideporte",
                    description: "Competición en varios deportes con inscripción por equipo",
                    baseRevenue: 320,
                    difficulty: "Medio",
                    timeRequired: 2,
                    resources: ["Instalaciones deportivas", "Equipamiento", "Árbitros", "Premios"]
                },
                {
                    title: "Ciclo de Conferencias Temáticas",
                    description: "Charlas sobre el destino del viaje con entrada pagada",
                    baseRevenue: 280,
                    difficulty: "Medio",
                    timeRequired: 4,
                    resources: ["Ponentes", "Sala de conferencias", "Material audiovisual", "Catering"]
                },
                {
                    title: "Festival de Cine al Aire Libre",
                    description: "Proyección de películas relacionadas con el destino",
                    baseRevenue: 300,
                    difficulty: "Medio",
                    timeRequired: 1,
                    resources: ["Pantalla gigante", "Proyector", "Equipo de sonido", "Palomitas de maíz"]
                }
            ],
            
            high: [
                {
                    title: "Hackathon Solidario",
                    description: "Competición de programación para crear soluciones para el destino",
                    baseRevenue: 800,
                    difficulty: "Difícil",
                    timeRequired: 7,
                    resources: ["Equipos informáticos", "Mentores técnicos", "Espacio 24/7", "Premios significativos"]
                },
                {
                    title: "Gala de Gala Benéfica",
                    description: "Evento formal con cena, espectáculos y subasta silenciosa",
                    baseRevenue: 1200,
                    difficulty: "Difícil",
                    timeRequired: 8,
                    resources: ["Sala de eventos", "Catering profesional", "Entretenimiento", "Patrocinadores"]
                },
                {
                    title: "Expedición de Fin de Semana",
                    description: "Viaje de preparación de 2 días al destino principal",
                    baseRevenue: 600,
                    difficulty: "Difícil",
                    timeRequired: 6,
                    resources: ["Transporte", "Alojamiento", "Comidas", "Guía local", "Seguro de viaje"]
                },
                {
                    title: "Festival Musical Local",
                    description: "Organiza un festival con bandas locales y venta de comida",
                    baseRevenue: 1000,
                    difficulty: "Difícil",
                    timeRequired: 10,
                    resources: ["Escenario", "Equipo de sonido", "Bandas musicales", "Permisos municipales", "Seguridad"]
                },
                {
                    title: "Curso Intensivo de Idiomas",
                    description: "Clases intensivas del idioma del destino con certificado",
                    baseRevenue: 450,
                    difficulty: "Difícil",
                    timeRequired: 12,
                    resources: ["Profesor nativo", "Material didáctico", "Aulas adecuadas", "Certificados"]
                }
            ]
        };
    }
    
    initializeRewardTemplates() {
        return {
            individual: [
                "Badge de Bronce del Viaje",
                "Camiseta exclusiva del destino",
                "Fotografía profesional del viaje",
                "Acceso prioritario a futuros eventos",
                "Certificado de participación",
                "Descuento del 10% en próximos viajes",
                "Merchandise oficial del viaje",
                "Reconocimiento en redes sociales"
            ],
            group: [
                "Upgrade gratuito de alojamiento",
                "Actividad extra incluida",
                "Cena especial en el destino",
                "Transporte premium",
                "Kit de bienvenida exclusivo",
                "Sesión de fotos grupal profesional",
                "Evento de networking post-viaje",
                "Membresía VIP por 6 meses"
            ],
            milestones: [
                "25% - Equipación básica del viaje",
                "50% - Upgrade de transporte",
                "75% - Actividad sorpresa incluida",
                "100% - Viaje completo garantizado"
            ]
        };
    }
    
    initializeDifficultySettings() {
        return {
            easy: { multiplier: 1.0, timeMultiplier: 1.0, successRate: 0.9 },
            medium: { multiplier: 1.3, timeMultiplier: 1.5, successRate: 0.75 },
            hard: { multiplier: 1.8, timeMultiplier: 2.0, successRate: 0.6 },
            expert: { multiplier: 2.5, timeMultiplier: 2.5, successRate: 0.45 }
        };
    }
    
    generateMonetizationPlan(totalBudget, departureDate, numPeople = 25, destination = 'Generic') {
        const today = new Date();
        const departure = new Date(departureDate);
        const timeFrame = Math.ceil((departure - today) / (1000 * 60 * 60 * 24));
        
        if (timeFrame <= 0) {
            throw new Error('La fecha de salida debe ser posterior a hoy');
        }
        
        const plan = {
            id: this.generatePlanId(),
            totalBudget: totalBudget,
            timeFrame: timeFrame,
            numPeople: numPeople,
            destination: destination,
            currentAmount: 0,
            progress: 0,
            weeklyGoals: this.calculateWeeklyGoals(totalBudget, timeFrame),
            challenges: this.generateChallenges(totalBudget, timeFrame, destination),
            milestones: this.generateMilestones(totalBudget),
            rewards: this.generateRewards(totalBudget),
            riskAssessment: this.assessRisk(totalBudget, timeFrame, numPeople),
            recommendations: this.generateRecommendations(totalBudget, timeFrame),
            createdAt: new Date(),
            status: 'active'
        };
        
        this.plans.set(plan.id, plan);
        return plan;
    }
    
    calculateWeeklyGoals(totalBudget, timeFrame) {
        const weeks = Math.ceil(timeFrame / 7);
        const weeklyTarget = Math.ceil(totalBudget / weeks);
        const goals = [];
        
        for (let i = 1; i <= weeks; i++) {
            const cumulativeTarget = weeklyTarget * i;
            const isCriticalWeek = i === weeks || i === Math.ceil(weeks * 0.5) || i === Math.ceil(weeks * 0.75);
            
            goals.push({
                week: i,
                target: weeklyTarget,
                cumulativeTarget: cumulativeTarget,
                currentAmount: 0,
                progress: 0,
                isCritical: isCriticalWeek,
                status: 'pending'
            });
        }
        
        return goals;
    }
    
    generateChallenges(totalBudget, timeFrame, destination) {
        const weeks = Math.ceil(timeFrame / 7);
        const challenges = [];
        
        // Determine difficulty based on budget and timeframe
        const difficulty = this.calculateDifficulty(totalBudget, timeFrame);
        const challengePool = this.challengeTemplates[difficulty];
        
        // Calculate how many challenges we need
        const challengeCount = Math.min(weeks, 12); // Max 12 challenges
        const challengesPerWeek = Math.ceil(challengeCount / weeks);
        
        let currentWeek = 1;
        let challengeIndex = 0;
        
        while (challengeIndex < challengeCount) {
            const baseChallenge = challengePool[challengeIndex % challengePool.length];
            const adjustedChallenge = this.adjustChallengeForBudget(
                baseChallenge, 
                totalBudget, 
                challengeCount, 
                destination
            );
            
            challenges.push({
                id: challengeIndex + 1,
                week: currentWeek,
                ...adjustedChallenge,
                progress: 0,
                status: 'pending',
                deadline: this.calculateChallengeDeadline(currentWeek, timeFrame),
                participants: Math.floor(Math.random() * 15) + 5 // 5-20 participants
            });
            
            challengeIndex++;
            if (challengeIndex % challengesPerWeek === 0) {
                currentWeek++;
            }
        }
        
        return challenges;
    }
    
    calculateDifficulty(totalBudget, timeFrame) {
        const budgetLevel = totalBudget / 1000; // Budget in thousands
        const timePressure = 30 / timeFrame; // Higher pressure = shorter time
        
        const difficultyScore = budgetLevel * timePressure;
        
        if (difficultyScore < 5) return 'low';
        if (difficultyScore < 15) return 'medium';
        return 'high';
    }
    
    adjustChallengeForBudget(baseChallenge, totalBudget, challengeCount, destination) {
        const budgetPerChallenge = totalBudget / challengeCount;
        const adjustmentFactor = budgetPerChallenge / 500; // 500€ as baseline
        
        return {
            ...baseChallenge,
            title: this.personalizeChallengeTitle(baseChallenge.title, destination),
            description: this.personalizeChallengeDescription(baseChallenge.description, destination),
            targetAmount: Math.round(baseChallenge.baseRevenue * adjustmentFactor),
            estimatedRevenue: Math.round(baseChallenge.baseRevenue * adjustmentFactor * 0.8) // 80% success rate
        };
    }
    
    personalizeChallengeTitle(title, destination) {
        const destinationThemes = {
            'Barcelona': title.replace('temática', 'Gaudí'),
            'París': title.replace('temática', 'Parísina'),
            'Roma': title.replace('temática', 'Romana'),
            'Ámsterdam': title.replace('temática', 'Holandesa'),
            'Praga': title.replace('temática', 'Checa')
        };
        
        return destinationThemes[destination] || title;
    }
    
    personalizeChallengeDescription(description, destination) {
        const destinationElements = {
            'Barcelona': 'con elementos de la arquitectura modernista',
            'París': 'con toques franceses y románticos',
            'Roma': 'con inspiración en el arte renacentista',
            'Ámsterdam': 'con el encanto de los canales',
            'Praga': 'con la magia de la arquitectura gótica'
        };
        
        return description + (destinationElements[destination] || '');
    }
    
    calculateChallengeDeadline(week, totalTimeFrame) {
        const today = new Date();
        const deadline = new Date(today.getTime() + (week * 7 * 24 * 60 * 60 * 1000));
        
        // Ensure deadline doesn't exceed departure date
        const departureDate = new Date(today.getTime() + (totalTimeFrame * 24 * 60 * 60 * 1000));
        return deadline > departureDate ? departureDate : deadline;
    }
    
    generateMilestones(totalBudget) {
        return [
            {
                percentage: 25,
                amount: Math.round(totalBudget * 0.25),
                title: "Meta Inicial Alcanzada",
                reward: this.rewardTemplates.milestones[0],
                unlocked: false,
                celebration: "🎉"
            },
            {
                percentage: 50,
                amount: Math.round(totalBudget * 0.50),
                title: "Mitad del Camino",
                reward: this.rewardTemplates.milestones[1],
                unlocked: false,
                celebration: "🚀"
            },
            {
                percentage: 75,
                amount: Math.round(totalBudget * 0.75),
                title: "Casi Listos",
                reward: this.rewardTemplates.milestones[2],
                unlocked: false,
                celebration: "⭐"
            },
            {
                percentage: 100,
                amount: totalBudget,
                title: "¡Meta Completa!",
                reward: this.rewardTemplates.milestones[3],
                unlocked: false,
                celebration: "🏆"
            }
        ];
    }
    
    generateRewards(totalBudget) {
        const rewardLevel = totalBudget > 10000 ? 'premium' : totalBudget > 5000 ? 'standard' : 'basic';
        
        return {
            individual: this.rewardTemplates.individual.slice(0, rewardLevel === 'premium' ? 6 : rewardLevel === 'standard' ? 4 : 3),
            group: this.rewardTemplates.group.slice(0, rewardLevel === 'premium' ? 6 : rewardLevel === 'standard' ? 4 : 3),
            special: this.generateSpecialRewards(totalBudget)
        };
    }
    
    generateSpecialRewards(totalBudget) {
        const specials = [];
        
        if (totalBudget > 8000) {
            specials.push("Upgrade gratuito de alojamiento");
        }
        
        if (totalBudget > 12000) {
            specials.push("Actividad VIP exclusiva incluida");
        }
        
        if (totalBudget > 15000) {
            specials.push("Sesión de fotos profesional grupal");
        }
        
        if (totalBudget > 20000) {
            specials.push("Transporte premium garantizado");
        }
        
        return specials;
    }
    
    assessRisk(totalBudget, timeFrame, numPeople) {
        const riskFactors = {
            timePressure: timeFrame < 30 ? 'High' : timeFrame < 60 ? 'Medium' : 'Low',
            budgetComplexity: totalBudget > 15000 ? 'High' : totalBudget > 8000 ? 'Medium' : 'Low',
            groupSize: numPeople > 40 ? 'High' : numPeople > 25 ? 'Medium' : 'Low'
        };
        
        const overallRisk = this.calculateOverallRisk(riskFactors);
        
        return {
            level: overallRisk,
            factors: riskFactors,
            mitigation: this.generateMitigationStrategies(overallRisk),
            backupPlan: this.generateBackupPlan(overallRisk, totalBudget)
        };
    }
    
    calculateOverallRisk(factors) {
        const riskScores = {
            'High': 3,
            'Medium': 2,
            'Low': 1
        };
        
        const totalScore = Object.values(factors).reduce((sum, factor) => sum + riskScores[factor], 0);
        
        if (totalScore >= 7) return 'High';
        if (totalScore >= 4) return 'Medium';
        return 'Low';
    }
    
    generateMitigationStrategies(riskLevel) {
        const strategies = {
            'High': [
                "Implementar retos semanales más frecuentes",
                "Establecer múltiples fuentes de ingreso",
                "Crear plan de contingencia con patrocinadores",
                "Monitorear progreso diariamente"
            ],
            'Medium': [
                "Aumentar la frecuencia de retos",
                "Diversificar tipos de recaudación",
                "Establecer hitos de control más frecuentes"
            ],
            'Low': [
                "Seguir el plan establecido",
                "Monitoreo semanal del progreso"
            ]
        };
        
        return strategies[riskLevel] || strategies['Low'];
    }
    
    generateBackupPlan(riskLevel, totalBudget) {
        const backupAmount = Math.round(totalBudget * 0.3); // 30% as backup target
        
        return {
            targetAmount: backupAmount,
            strategies: [
                "Patrocinio de empresas locales",
                "Crowdfunding familiar y amigos",
                "Venta de productos digitales",
                "Servicios de voluntariado a cambio de donaciones"
            ],
            timeline: "Últimas 2 semanas antes del viaje"
        };
    }
    
    generateRecommendations(totalBudget, timeFrame) {
        return [
            {
                category: "Estrategia",
                title: "Diversificación de Fuentes",
                description: "No dependas de una sola fuente de ingreso. Combina diferentes tipos de retos.",
                priority: "High"
            },
            {
                category: "Comunicación",
                title: "Transparencia Total",
                description: "Mantén a todos informados sobre el progreso y los próximos pasos.",
                priority: "High"
            },
            {
                category: "Motivación",
                title: "Celebrar los Pequeños Éxitos",
                description: "Reconoce los logros parciales para mantener el entusiasmo.",
                priority: "Medium"
            },
            {
                category: "Planificación",
                title: "Plan B Siempre Listo",
                description: "Ten alternativas preparadas por si algo sale mal.",
                priority: "Medium"
            }
        ];
    }
    
    generatePlanId() {
        return 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Method to update progress
    updateProgress(planId, amount) {
        const plan = this.plans.get(planId);
        if (!plan) return null;
        
        plan.currentAmount += amount;
        plan.progress = Math.round((plan.currentAmount / plan.totalBudget) * 100);
        
        // Update weekly goals
        this.updateWeeklyGoals(plan, amount);
        
        // Check milestone unlocks
        this.checkMilestoneUnlocks(plan);
        
        // Update challenge progress
        this.updateChallengeProgress(plan, amount);
        
        return plan;
    }
    
    updateWeeklyGoals(plan, amount) {
        const today = new Date();
        const currentWeek = Math.ceil((today - plan.createdAt) / (7 * 24 * 60 * 60 * 1000));
        
        plan.weeklyGoals.forEach(goal => {
            if (goal.week === currentWeek) {
                goal.currentAmount += amount;
                goal.progress = Math.round((goal.currentAmount / goal.target) * 100);
                goal.status = goal.progress >= 100 ? 'completed' : 'in_progress';
            }
        });
    }
    
    checkMilestoneUnlocks(plan) {
        plan.milestones.forEach(milestone => {
            if (!milestone.unlocked && plan.currentAmount >= milestone.amount) {
                milestone.unlocked = true;
                this.triggerMilestoneCelebration(plan, milestone);
            }
        });
    }
    
    triggerMilestoneCelebration(plan, milestone) {
        // This would trigger a celebration animation or notification
        console.log(`🎉 Milestone unlocked: ${milestone.title} - ${milestone.reward}`);
    }
    
    updateChallengeProgress(plan, amount) {
        // Distribute the amount among active challenges
        const activeChallenges = plan.challenges.filter(c => c.status === 'pending' || c.status === 'in_progress');
        const amountPerChallenge = amount / activeChallenges.length;
        
        activeChallenges.forEach(challenge => {
            challenge.currentAmount += amountPerChallenge;
            challenge.progress = Math.round((challenge.currentAmount / challenge.targetAmount) * 100);
            
            if (challenge.progress >= 100) {
                challenge.status = 'completed';
                challenge.completedAt = new Date();
            } else if (challenge.progress > 0) {
                challenge.status = 'in_progress';
            }
        });
    }
    
    // Get plan by ID
    getPlan(planId) {
        return this.plans.get(planId);
    }
    
    // Get all plans
    getAllPlans() {
        return Array.from(this.plans.values());
    }
    
    // Delete plan
    deletePlan(planId) {
        return this.plans.delete(planId);
    }
    
    // Export plan data
    exportPlan(planId) {
        const plan = this.plans.get(planId);
        if (!plan) return null;
        
        return {
            ...plan,
            exportDate: new Date(),
            format: 'Eventoo_Monetization_Plan_v1'
        };
    }
}

// Export for use in other modules
window.MonetizationPlanner = MonetizationPlanner;