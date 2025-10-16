// Genio Djink Travel Planner - Sistema completo de planificación de viajes
// Integrado con gamificación y recaudación de fondos

class TravelPlanner {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.proposals = [];
        this.selectedProposal = null;
        this.gamificationPlan = null;
        
        // Mock destinations with real travel data
        this.destinations = {
            'barcelona': {
                name: 'Barcelona, España',
                country: 'España',
                coordinates: { lat: 41.3851, lng: 2.1734 },
                cultural: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter', 'Picasso Museum'],
                adventure: ['Montserrat', 'Costa Brava', 'Tibidabo', 'Bike Tours'],
                hybrid: ['Camp Nou', 'Beach + Culture', 'Food Tours', 'Architecture Walk'],
                avgPrice: { low: 250, medium: 400, high: 600 }
            },
            'paris': {
                name: 'París, Francia',
                country: 'Francia',
                coordinates: { lat: 48.8566, lng: 2.3522 },
                cultural: ['Torre Eiffel', 'Louvre', 'Versailles', 'Notre Dame'],
                adventure: ['Eurodisney', 'Seine Cruise', 'Montmartre', 'Catacombs'],
                hybrid: ['Champs-Élysées', 'Latin Quarter', 'Moulin Rouge', 'Seine Dinner'],
                avgPrice: { low: 300, medium: 500, high: 750 }
            },
            'rome': {
                name: 'Roma, Italia',
                country: 'Italia',
                coordinates: { lat: 41.9028, lng: 12.4964 },
                cultural: ['Coliseo', 'Vaticano', 'Fontana di Trevi', 'Panteón'],
                adventure: ['Vespa Tours', 'Cooking Class', 'Underground Rome', 'Bike Tours'],
                hybrid: ['Trastevere', 'Food Tours', 'Villa Borghese', 'Shopping'],
                avgPrice: { low: 280, medium: 450, high: 650 }
            },
            'amsterdam': {
                name: 'Ámsterdam, Países Bajos',
                country: 'Países Bajos',
                coordinates: { lat: 52.3676, lng: 4.9041 },
                cultural: ['Rijksmuseum', 'Anne Frank House', 'Van Gogh Museum', 'Canals'],
                adventure: ['Bike Tours', 'Canal Cruise', 'Heineken Experience', 'Dungeon'],
                hybrid: ['Jordaan District', 'Food Tours', 'Markets', 'Coffee Shops'],
                avgPrice: { low: 320, medium: 480, high: 700 }
            },
            'prague': {
                name: 'Praga, República Checa',
                country: 'República Checa',
                coordinates: { lat: 50.0755, lng: 14.4378 },
                cultural: ['Castillo de Praga', 'Puente de Carlos', 'Reloj Astronómico', 'Catedral'],
                adventure: ['Beer Tours', 'River Cruise', 'Underground Tours', 'Bike Tours'],
                hybrid: ['Old Town Square', 'Food Tours', 'Shopping', 'Nightlife'],
                avgPrice: { low: 200, medium: 350, high: 500 }
            }
        };
        
        this.accommodationPrices = {
            'hotel-3': { multiplier: 1.0, basePrice: 60 },
            'hotel-4': { multiplier: 1.5, basePrice: 90 },
            'hostel': { multiplier: 0.6, basePrice: 25 },
            'camping': { multiplier: 0.4, basePrice: 15 },
            'resort': { multiplier: 2.0, basePrice: 120 }
        };
        
        this.transportPrices = {
            'bus-autocar': { basePrice: 0.15, perKm: 0.05 },
            'train': { basePrice: 20, perKm: 0.08 },
            'flight': { basePrice: 80, perKm: 0.12 },
            'mixed': { basePrice: 50, perKm: 0.07 }
        };
    }
    
    init() {
        this.bindEvents();
        this.setMinDate();
    }
    
    bindEvents() {
        const form = document.getElementById('travelForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.validateField(input));
        });
    }
    
    setMinDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const departureInput = document.getElementById('departureDate');
        departureInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldContainer = field.closest('.space-y-4');
        
        // Remove existing error messages
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!value && field.required) {
            this.showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        // Specific validations
        if (field.id === 'departureDate') {
            const selectedDate = new Date(value);
            const today = new Date();
            if (selectedDate <= today) {
                this.showFieldError(field, 'La fecha debe ser posterior a hoy');
                return false;
            }
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        const fieldContainer = field.closest('.space-y-4');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-400 text-sm mt-1';
        errorDiv.textContent = message;
        fieldContainer.appendChild(errorDiv);
        
        field.classList.add('border-red-400');
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const form = e.target;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Por favor completa todos los campos obligatorios', 'error');
            return;
        }
        
        // Collect form data
        this.formData = {
            destination: document.getElementById('destination').value,
            departureDate: document.getElementById('departureDate').value,
            numPeople: document.getElementById('numPeople').value,
            numNights: document.getElementById('numNights').value,
            accommodationType: document.getElementById('accommodationType').value,
            mealPlan: document.getElementById('mealPlan').value,
            budget: document.getElementById('budget').value,
            travelType: document.getElementById('travelType').value,
            transport: document.getElementById('transport').value,
            mandatoryActivities: document.getElementById('mandatoryActivities').value,
            restrictions: document.getElementById('restrictions').value
        };
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate API processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate proposals
        this.proposals = this.generateTravelProposals();
        
        // Hide loading and show proposals
        this.hideLoadingState();
        this.displayProposals();
        
        // Generate gamification plan
        this.gamificationPlan = this.generateGamificationPlan();
        this.displayGamificationPlan();
    }
    
    showLoadingState() {
        const searchButton = document.getElementById('searchButton');
        const searchText = document.getElementById('searchText');
        const searchLoading = document.getElementById('searchLoading');
        
        searchButton.disabled = true;
        searchText.classList.add('hidden');
        searchLoading.classList.remove('hidden');
        
        // Add genio working animation
        const genio = document.querySelector('.genio-active');
        if (genio) {
            genio.style.animation = 'genioFloat 0.5s ease-in-out infinite';
        }
    }
    
    hideLoadingState() {
        const searchButton = document.getElementById('searchButton');
        const searchText = document.getElementById('searchText');
        const searchLoading = document.getElementById('searchLoading');
        
        searchButton.disabled = false;
        searchText.classList.remove('hidden');
        searchLoading.classList.add('hidden');
        
        // Reset genio animation
        const genio = document.querySelector('.genio-active');
        if (genio) {
            genio.style.animation = 'genioFloat 3s ease-in-out infinite';
        }
    }
    
    generateTravelProposals() {
        const baseDestination = this.findMatchingDestination(this.formData.destination);
        const numPeople = this.parsePeopleCount(this.formData.numPeople);
        const numNights = this.parseNightsCount(this.formData.numNights);
        const budgetRange = this.parseBudgetRange(this.formData.budget);
        
        const proposals = [];
        
        // Proposal 1: Cultural Pure
        const culturalProposal = this.createCulturalProposal(baseDestination, numPeople, numNights, budgetRange);
        proposals.push(culturalProposal);
        
        // Proposal 2: Adventure Focus
        const adventureProposal = this.createAdventureProposal(baseDestination, numPeople, numNights, budgetRange);
        proposals.push(adventureProposal);
        
        // Proposal 3: Hybrid Mix
        const hybridProposal = this.createHybridProposal(baseDestination, numPeople, numNights, budgetRange);
        proposals.push(hybridProposal);
        
        return proposals.sort((a, b) => b.score - a.score);
    }
    
    findMatchingDestination(input) {
        // Simple matching logic - in real implementation would use more sophisticated matching
        const inputLower = input.toLowerCase();
        for (const [key, destination] of Object.entries(this.destinations)) {
            if (inputLower.includes(key) || destination.name.toLowerCase().includes(inputLower)) {
                return destination;
            }
        }
        
        // Default to Barcelona if no match found
        return this.destinations['barcelona'];
    }
    
    parsePeopleCount(range) {
        const ranges = {
            '10-15': 12,
            '16-25': 20,
            '26-40': 33,
            '41+': 45
        };
        return ranges[range] || 20;
    }
    
    parseNightsCount(range) {
        const ranges = {
            '2-3': 2.5,
            '4-5': 4.5,
            '6-7': 6.5,
            '8+': 8
        };
        return ranges[range] || 4;
    }
    
    parseBudgetRange(range) {
        const ranges = {
            '150-250': { min: 150, max: 250, level: 'low' },
            '250-400': { min: 250, max: 400, level: 'medium' },
            '400-600': { min: 400, max: 600, level: 'high' },
            '600+': { min: 600, max: 1000, level: 'premium' }
        };
        return ranges[range] || ranges['250-400'];
    }
    
    createCulturalProposal(destination, numPeople, numNights, budgetRange) {
        const accommodationPrice = this.calculateAccommodationPrice(numNights, numPeople);
        const transportPrice = this.calculateTransportPrice(destination);
        const activitiesPrice = this.calculateActivitiesPrice(destination.cultural, numPeople);
        const totalPrice = accommodationPrice + transportPrice + activitiesPrice;
        
        return {
            id: 'cultural',
            title: 'Viaje Cultural Inmersivo',
            subtitle: 'Arte, historia y tradición auténtica',
            destination: destination,
            type: 'cultural',
            highlights: destination.cultural.slice(0, 4),
            price: {
                perPerson: Math.round(totalPrice / numPeople),
                total: Math.round(totalPrice),
                savings: Math.round(totalPrice * 0.15) // 15% savings
            },
            score: this.calculateScore(totalPrice, budgetRange, 'cultural'),
            inclusions: [
                'Guía turístico profesional',
                'Entradas a museos y monumentos',
                'Transporte interno',
                'Seguro de viaje',
                'Material educativo'
            ],
            accommodation: this.getAccommodationDetails(),
            transport: this.getTransportDetails(),
            rating: 4.8,
            reviews: Math.floor(Math.random() * 500) + 200
        };
    }
    
    createAdventureProposal(destination, numPeople, numNights, budgetRange) {
        const accommodationPrice = this.calculateAccommodationPrice(numNights, numPeople);
        const transportPrice = this.calculateTransportPrice(destination);
        const activitiesPrice = this.calculateActivitiesPrice(destination.adventure, numPeople);
        const totalPrice = accommodationPrice + transportPrice + activitiesPrice;
        
        return {
            id: 'adventure',
            title: 'Aventura Extrema Total',
            subtitle: 'Emociones fuertes y experiencias únicas',
            destination: destination,
            type: 'adventure',
            highlights: destination.adventure.slice(0, 4),
            price: {
                perPerson: Math.round(totalPrice / numPeople),
                total: Math.round(totalPrice),
                savings: Math.round(totalPrice * 0.12) // 12% savings
            },
            score: this.calculateScore(totalPrice, budgetRange, 'adventure'),
            inclusions: [
                'Monitor de actividades especializado',
                'Equipo de seguridad completo',
                'Seguro de aventura',
                'Fotografía profesional',
                'Certificado de participación'
            ],
            accommodation: this.getAccommodationDetails(),
            transport: this.getTransportDetails(),
            rating: 4.6,
            reviews: Math.floor(Math.random() * 400) + 150
        };
    }
    
    createHybridProposal(destination, numPeople, numNights, budgetRange) {
        const accommodationPrice = this.calculateAccommodationPrice(numNights, numPeople);
        const transportPrice = this.calculateTransportPrice(destination);
        const activitiesPrice = this.calculateActivitiesPrice(destination.hybrid, numPeople);
        const totalPrice = accommodationPrice + transportPrice + activitiesPrice;
        
        return {
            id: 'hybrid',
            title: 'Experiencia Mágica Completa',
            subtitle: 'La perfecta combinación de cultura y diversión',
            destination: destination,
            type: 'hybrid',
            highlights: destination.hybrid.slice(0, 4),
            price: {
                perPerson: Math.round(totalPrice / numPeople),
                total: Math.round(totalPrice),
                savings: Math.round(totalPrice * 0.18) // 18% savings
            },
            score: this.calculateScore(totalPrice, budgetRange, 'hybrid'),
            inclusions: [
                'Guía multilingüe experto',
                'Actividades mixtas balanceadas',
                'Tiempo libre programado',
                'Kit de viajero',
                'Soporte 24/7'
            ],
            accommodation: this.getAccommodationDetails(),
            transport: this.getTransportDetails(),
            rating: 4.9,
            reviews: Math.floor(Math.random() * 600) + 300
        };
    }
    
    calculateAccommodationPrice(nights, people) {
        const accType = this.formData.accommodationType;
        const priceInfo = this.accommodationPrices[accType];
        
        if (!priceInfo) return nights * people * 50; // Default price
        
        const basePricePerNight = priceInfo.basePrice * priceInfo.multiplier;
        return Math.round(nights * people * basePricePerNight);
    }
    
    calculateTransportPrice(destination) {
        const transportType = this.formData.transport;
        const priceInfo = this.transportPrices[transportType];
        
        if (!priceInfo) return 100; // Default price
        
        // Simulate distance calculation
        const distance = Math.random() * 1000 + 200; // 200-1200km
        return Math.round(priceInfo.basePrice + (distance * priceInfo.perKm));
    }
    
    calculateActivitiesPrice(activities, people) {
        const baseActivityPrice = 25; // Average per person per activity
        return Math.round(activities.length * people * baseActivityPrice);
    }
    
    calculateScore(totalPrice, budgetRange, type) {
        let score = 50; // Base score
        
        // Price fit (0-40 points)
        const pricePerPerson = totalPrice / this.parsePeopleCount(this.formData.numPeople);
        if (pricePerPerson >= budgetRange.min && pricePerPerson <= budgetRange.max) {
            score += 40;
        } else if (pricePerPerson <= budgetRange.max * 1.2) {
            score += 25;
        } else if (pricePerPerson <= budgetRange.max * 1.5) {
            score += 10;
        }
        
        // Type match (0-10 points)
        if (type === this.formData.travelType) {
            score += 10;
        }
        
        return Math.min(score, 100);
    }
    
    getAccommodationDetails() {
        const types = {
            'hotel-3': 'Hotel 3 estrellas en centro ciudad',
            'hotel-4': 'Hotel 4 estrellas con amenities',
            'hostel': 'Hostel juvenil con ambiente internacional',
            'camping': 'Camping con instalaciones modernas',
            'resort': 'Resort con piscina y spa'
        };
        
        return types[this.formData.accommodationType] || 'Alojamiento confortable';
    }
    
    getTransportDetails() {
        const types = {
            'bus-autocar': 'Autocar privado con wifi y aire acondicionado',
            'train': 'Tren de alta velocidad con asientos cómodos',
            'flight': 'Vuelo directo con equipaje incluido',
            'mixed': 'Combinación de transportes óptima'
        };
        
        return types[this.formData.transport] || 'Transporte seguro y cómodo';
    }
    
    displayProposals() {
        const proposalsSection = document.getElementById('proposalsSection');
        const proposalsContainer = document.getElementById('proposalsContainer');
        
        proposalsSection.classList.remove('hidden');
        proposalsContainer.innerHTML = '';
        
        this.proposals.forEach((proposal, index) => {
            const proposalCard = this.createProposalCard(proposal, index);
            proposalsContainer.appendChild(proposalCard);
        });
        
        // Smooth scroll to proposals
        proposalsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    createProposalCard(proposal, index) {
        const card = document.createElement('div');
        card.className = 'proposal-card rounded-2xl p-6 cursor-pointer';
        
        const typeColors = {
            cultural: 'from-blue-500/20 to-purple-500/20',
            adventure: 'from-red-500/20 to-orange-500/20',
            hybrid: 'from-green-500/20 to-emerald-500/20'
        };
        
        const typeIcons = {
            cultural: '🏛️',
            adventure: '🏔️',
            hybrid: '🌟'
        };
        
        card.innerHTML = `
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">${typeIcons[proposal.type]}</div>
                <h3 class="text-2xl font-bold text-white mb-2">${proposal.title}</h3>
                <p class="text-gray-400 text-sm">${proposal.subtitle}</p>
            </div>
            
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-sm text-gray-400">Puntuación del Genio</div>
                    <div class="flex items-center gap-2">
                        <div class="text-yellow-400 font-bold">${proposal.score}/100</div>
                        <div class="w-16 h-2 bg-gray-700 rounded-full">
                            <div class="progress-bar h-2 rounded-full" style="width: ${proposal.score}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-400">Por persona:</span>
                        <span class="text-2xl font-bold text-green-400">€${proposal.price.perPerson}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-400">Total grupo:</span>
                        <span class="text-xl font-bold text-white">€${proposal.price.total}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-400">Ahorro incluido:</span>
                        <span class="text-green-400 font-bold">€${proposal.price.savings}</span>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h4 class="font-bold text-blue-300 mb-3">⭐ Destacados del Viaje</h4>
                <div class="grid grid-cols-2 gap-2">
                    ${proposal.highlights.map(highlight => `
                        <div class="text-sm text-gray-300 bg-white/5 rounded-lg p-2 text-center">
                            ${highlight}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mb-6">
                <h4 class="font-bold text-blue-300 mb-3">✅ Incluye</h4>
                <div class="space-y-1">
                    ${proposal.inclusions.map(inclusion => `
                        <div class="text-sm text-gray-300 flex items-center gap-2">
                            <span class="text-green-400">✓</span>
                            ${inclusion}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mb-6">
                <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-2">
                        <span class="text-yellow-400">⭐</span>
                        <span>${proposal.rating}/5</span>
                    </div>
                    <span class="text-gray-400">${proposal.reviews} reseñas</span>
                </div>
            </div>
            
            <button onclick="travelPlanner.selectProposal(${index})" 
                    class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                🪄 Elegir esta Opción Mágica
            </button>
        `;
        
        return card;
    }
    
    selectProposal(index) {
        this.selectedProposal = this.proposals[index];
        
        // Highlight selected proposal
        document.querySelectorAll('.proposal-card').forEach((card, i) => {
            if (i === index) {
                card.classList.add('ring-2', 'ring-blue-400');
            } else {
                card.classList.remove('ring-2', 'ring-blue-400');
            }
        });
        
        this.showNotification(`¡Excelente elección! Has seleccionado: ${this.selectedProposal.title}`, 'success');
        
        // Scroll to gamification section
        setTimeout(() => {
            document.getElementById('gamificationSection').scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    }
    
    generateGamificationPlan() {
        if (!this.selectedProposal) return null;
        
        const totalAmount = this.selectedProposal.price.total;
        const numPeople = this.parsePeopleCount(this.formData.numPeople);
        const timeFrame = this.calculateTimeFrame();
        
        return {
            targetAmount: totalAmount,
            currentAmount: 0,
            progress: 0,
            timeFrame: timeFrame,
            challenges: this.generateChallenges(totalAmount, timeFrame),
            milestones: this.generateMilestones(totalAmount),
            rewards: this.generateRewards(),
            teamGoal: Math.round(totalAmount / numPeople),
            estimatedCompletion: this.calculateCompletionDate(timeFrame)
        };
    }
    
    calculateTimeFrame() {
        const departureDate = new Date(this.formData.departureDate);
        const today = new Date();
        const diffTime = departureDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(diffDays, 30); // Minimum 30 days
    }
    
    generateChallenges(totalAmount, timeFrame) {
        const challenges = [];
        const challengeCount = Math.min(Math.floor(timeFrame / 7), 10); // Max 10 challenges
        
        for (let i = 0; i < challengeCount; i++) {
            const challengeAmount = Math.round(totalAmount / challengeCount);
            challenges.push({
                id: i + 1,
                title: `Reto Semana ${i + 1}`,
                description: this.getChallengeDescription(i),
                targetAmount: challengeAmount,
                currentAmount: 0,
                progress: 0,
                deadline: new Date(Date.now() + ((i + 1) * 7 * 24 * 60 * 60 * 1000)),
                reward: this.getChallengeReward(i),
                difficulty: this.getChallengeDifficulty(i)
            });
        }
        
        return challenges;
    }
    
    getChallengeDescription(index) {
        const descriptions = [
            'Organiza una cena benéfica temática',
            'Crea una rifa con premios locales',
            'Haz un maratón de juegos benéficos',
            'Organiza una feria de artesanía',
            'Crea un torneo deportivo',
            'Haz una subasta de objetos donados',
            'Organiza un karaoke benéfico',
            'Crea un escape room solidario',
            'Haz una exposición fotográfica',
            'Organiza un concierto local'
        ];
        
        return descriptions[index] || 'Actividad de recaudación creativa';
    }
    
    getChallengeReward(index) {
        const rewards = [
            'Descuento del 5% en el viaje',
            'Merchandise exclusivo del viaje',
            'Upgrade de alojamiento gratuito',
            'Actividad extra incluida',
            'Kit de viaje personalizado',
            'Fotografía profesional del viaje',
            'Cena especial en el destino',
            'Souvenir único del lugar',
            'Certificado de participación',
            'Sorpresa mágica del Genio'
        ];
        
        return rewards[index] || 'Recompensa especial';
    }
    
    getChallengeDifficulty(index) {
        const difficulties = ['Fácil', 'Medio', 'Difícil', 'Experto'];
        return difficulties[index % 4];
    }
    
    generateMilestones(totalAmount) {
        return [
            { percentage: 25, amount: Math.round(totalAmount * 0.25), reward: 'Camiseta del viaje' },
            { percentage: 50, amount: Math.round(totalAmount * 0.50), reward: 'Upgrade de transporte' },
            { percentage: 75, amount: Math.round(totalAmount * 0.75), reward: 'Actividad extra sorpresa' },
            { percentage: 100, amount: totalAmount, reward: 'Viaje completo garantizado' }
        ];
    }
    
    generateRewards() {
        return {
            individual: [
                'Badge de participación',
                'Puntos de experiencia',
                'Reconocimiento en el leaderboard',
                'Acceso exclusivo a contenidos'
            ],
            group: [
                'Descuento en próximos viajes',
                'Prioridad en futuras reservas',
                'Eventos exclusivos para participantes',
                'Membresía VIP temporal'
            ]
        };
    }
    
    calculateCompletionDate(timeFrame) {
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + timeFrame);
        return completionDate;
    }
    
    displayGamificationPlan() {
        const gamificationSection = document.getElementById('gamificationSection');
        const gamificationPlan = document.getElementById('gamificationPlan');
        
        gamificationSection.classList.remove('hidden');
        
        gamificationPlan.innerHTML = `
            <div class="gamification-card rounded-xl p-6 mb-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-yellow-400 mb-2">🎯 Meta: €${this.gamificationPlan.targetAmount.toLocaleString()}</h3>
                    <div class="text-gray-400 mb-4">Para el viaje a ${this.selectedProposal.destination.name}</div>
                    
                    <div class="w-full bg-gray-700 rounded-full h-4 mb-4">
                        <div class="progress-bar h-4 rounded-full" style="width: ${this.gamificationPlan.progress}%"></div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div class="text-2xl font-bold text-green-400">€${this.gamificationPlan.currentAmount}</div>
                            <div class="text-sm text-gray-400">Recaudado</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-blue-400">${this.gamificationPlan.timeFrame}</div>
                            <div class="text-sm text-gray-400">Días restantes</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-purple-400">€${this.gamificationPlan.teamGoal}</div>
                            <div class="text-sm text-gray-400">Por persona</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="glass rounded-xl p-6">
                    <h4 class="text-xl font-bold text-green-400 mb-4">🏆 Retos Semanales</h4>
                    <div class="space-y-3">
                        ${this.gamificationPlan.challenges.slice(0, 3).map(challenge => `
                            <div class="bg-white/5 rounded-lg p-3">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-bold text-white">${challenge.title}</span>
                                    <span class="text-xs px-2 py-1 rounded ${challenge.difficulty === 'Fácil' ? 'bg-green-500/30 text-green-400' : challenge.difficulty === 'Medio' ? 'bg-yellow-500/30 text-yellow-400' : 'bg-red-500/30 text-red-400'}">${challenge.difficulty}</span>
                                </div>
                                <p class="text-sm text-gray-400 mb-2">${challenge.description}</p>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-400">€${challenge.currentAmount} / €${challenge.targetAmount}</span>
                                    <span class="text-green-400">${challenge.reward}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="glass rounded-xl p-6">
                    <h4 class="text-xl font-bold text-purple-400 mb-4">⭐ Hitos del Viaje</h4>
                    <div class="space-y-3">
                        ${this.gamificationPlan.milestones.map(milestone => `
                            <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                                        ${milestone.percentage}%
                                    </div>
                                    <div>
                                        <div class="font-bold text-white">€${milestone.amount.toLocaleString()}</div>
                                        <div class="text-xs text-gray-400">${milestone.reward}</div>
                                    </div>
                                </div>
                                <div class="text-yellow-400">
                                    ${milestone.percentage <= 25 ? '🔓' : '🔒'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="this.showNotification('¡Plan de recaudación activado! El Genio Djink comenzará las campañas automáticamente.', 'success')" 
                        class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300">
                    🪄 Activar Plan de Recaudación
                </button>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
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

// Initialize the Travel Planner
let travelPlanner;

document.addEventListener('DOMContentLoaded', function() {
    travelPlanner = new TravelPlanner();
    travelPlanner.init();
    
    // Add some visual effects
    setInterval(() => {
        const genio = document.querySelector('.genio-active');
        if (genio && Math.random() > 0.8) {
            // Create sparkle effect
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'float 2s ease-out forwards';
            sparkle.style.fontSize = '20px';
            
            genio.parentElement.style.position = 'relative';
            genio.parentElement.appendChild(sparkle);
            
            setTimeout(() => {
                if (genio.parentElement.contains(sparkle)) {
                    genio.parentElement.removeChild(sparkle);
                }
            }, 2000);
        }
    }, 3000);
});

// Export for global access
window.TravelPlanner = TravelPlanner;