// Printful Integration Simulator for Eventoo Cognitive EDU
// Simula la integración con Printful API para productos personalizados

class PrintfulIntegration {
    constructor() {
        this.apiKey = 'pf_test_simulation_key';
        this.baseUrl = 'https://api.printful.com';
        this.products = {
            'ocean-guardian': {
                name: 'Ocean Guardian Collection',
                products: [
                    { id: 'pf-ocean-shirt', name: 'Camiseta Premium', price: 24.99, currency: 'EUR' },
                    { id: 'pf-ocean-hoodie', name: 'Sudadera', price: 39.99, currency: 'EUR' },
                    { id: 'pf-ocean-mug', name: 'Taza Ecológica', price: 14.99, currency: 'EUR' }
                ],
                designFile: 'ocean-guardian-design.png',
                unlocked: true
            },
            'forest-protector': {
                name: 'Forest Protector Collection',
                products: [
                    { id: 'pf-forest-shirt', name: 'Camiseta Orgánica', price: 27.99, currency: 'EUR' },
                    { id: 'pf-forest-bag', name: 'Bolsa Reutilizable', price: 19.99, currency: 'EUR' },
                    { id: 'pf-forest-bottle', name: 'Botella Eco', price: 24.99, currency: 'EUR' }
                ],
                designFile: 'forest-protector-design.png',
                unlocked: false
            },
            'mountain-explorer': {
                name: 'Mountain Explorer Collection',
                products: [
                    { id: 'pf-mountain-jacket', name: 'Chaqueta Técnica', price: 79.99, currency: 'EUR' },
                    { id: 'pf-mountain-shirt', name: 'Camiseta Dry-Fit', price: 29.99, currency: 'EUR' },
                    { id: 'pf-mountain-hat', name: 'Gorra Trail', price: 22.99, currency: 'EUR' }
                ],
                designFile: 'mountain-explorer-design.png',
                unlocked: true
            },
            'future-innovator': {
                name: 'Future Innovator Collection',
                products: [
                    { id: 'pf-future-hoodie', name: 'Tech Hoodie', price: 64.99, currency: 'EUR' },
                    { id: 'pf-future-shirt', name: 'Smart T-Shirt', price: 32.99, currency: 'EUR' },
                    { id: 'pf-future-hub', name: 'USB Hub', price: 24.99, currency: 'EUR' }
                ],
                designFile: 'future-innovator-design.png',
                unlocked: true
            },
            'ai-pioneer': {
                name: 'AI Pioneer Collection',
                products: [
                    { id: 'pf-ai-hoodie', name: 'Cyber Hoodie', price: 59.99, currency: 'EUR' },
                    { id: 'pf-ai-cap', name: 'Tech Cap', price: 19.99, currency: 'EUR' },
                    { id: 'pf-ai-pad', name: 'Mouse Pad RGB', price: 15.99, currency: 'EUR' }
                ],
                designFile: 'ai-pioneer-design.png',
                unlocked: true
            }
        };
        
        this.salesData = {
            totalRevenue: 165.0,
            totalOrders: 15,
            monthlySales: {
                '2025-01': { revenue: 45.0, orders: 5 },
                '2025-02': { revenue: 120.0, orders: 10 }
            }
        };
    }

    // Simula la creación de un producto en Printful
    async createProduct(collectionId, productData) {
        console.log(`🎨 Creando producto para colección: ${collectionId}`);
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const productId = `pf-${Date.now()}`;
        const mockResponse = {
            success: true,
            productId: productId,
            mockupUrl: `https://api.printful.com/mockup/${productId}`,
            status: 'created',
            estimatedProductionTime: '2-5 business days'
        };
        
        console.log(`✅ Producto creado: ${productId}`);
        return mockResponse;
    }

    // Simula el procesamiento de un pedido
    async processOrder(orderData) {
        console.log(`📦 Procesando pedido: ${orderData.orderId}`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const trackingNumber = `PF${Date.now()}`;
        const mockResponse = {
            success: true,
            orderId: orderData.orderId,
            status: 'processing',
            trackingNumber: trackingNumber,
            estimatedDelivery: '5-10 business days',
            productionCost: this.calculateProductionCost(orderData.items)
        };
        
        // Actualizar datos de ventas
        this.updateSalesData(orderData.total);
        
        console.log(`✅ Pedido procesado: ${trackingNumber}`);
        return mockResponse;
    }

    // Calcula el costo de producción (30% del precio de venta)
    calculateProductionCost(items) {
        let totalCost = 0;
        items.forEach(item => {
            totalCost += item.price * 0.3; // 30% para Printful
        });
        return totalCost;
    }

    // Actualiza los datos de ventas
    updateSalesData(amount) {
        this.salesData.totalRevenue += amount;
        this.salesData.totalOrders += 1;
        
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (!this.salesData.monthlySales[currentMonth]) {
            this.salesData.monthlySales[currentMonth] = { revenue: 0, orders: 0 };
        }
        
        this.salesData.monthlySales[currentMonth].revenue += amount;
        this.salesData.monthlySales[currentMonth].orders += 1;
    }

    // Obtiene estadísticas de ventas
    getSalesStats() {
        return {
            totalRevenue: this.salesData.totalRevenue,
            totalOrders: this.salesData.totalOrders,
            averageOrderValue: this.salesData.totalRevenue / this.salesData.totalOrders,
            monthlyGrowth: this.calculateMonthlyGrowth()
        };
    }

    // Calcula el crecimiento mensual
    calculateMonthlyGrowth() {
        const months = Object.keys(this.salesData.monthlySales).sort();
        if (months.length < 2) return 0;
        
        const currentMonth = months[months.length - 1];
        const previousMonth = months[months.length - 2];
        
        const currentRevenue = this.salesData.monthlySales[currentMonth].revenue;
        const previousRevenue = this.salesData.monthlySales[previousMonth].revenue;
        
        return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    }

    // Simula una campaña de marketing
    async launchMarketingCampaign(collectionId, budget = 100) {
        console.log(`🚀 Lanzando campaña para: ${collectionId} con presupuesto: €${budget}`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const campaignResults = {
            success: true,
            campaignId: `camp-${Date.now()}`,
            impressions: Math.floor(Math.random() * 5000) + 1000,
            clicks: Math.floor(Math.random() * 200) + 50,
            conversions: Math.floor(Math.random() * 20) + 5,
            revenueGenerated: Math.floor(Math.random() * 500) + 100,
            roi: ((Math.floor(Math.random() * 500) + 100) / budget) * 100
        };
        
        console.log(`📈 Campaña completada. ROI: ${campaignResults.roi.toFixed(2)}%`);
        return campaignResults;
    }

    // Obtiene productos desbloqueados para un usuario
    getUnlockedProducts(userProgress) {
        const unlocked = [];
        
        Object.keys(this.products).forEach(collectionId => {
            const collection = this.products[collectionId];
            if (collection.unlocked) {
                unlocked.push({
                    collectionId: collectionId,
                    name: collection.name,
                    products: collection.products,
                    designFile: collection.designFile
                });
            }
        });
        
        return unlocked;
    }

    // Simula el desbloqueo de una colección
    unlockCollection(collectionId) {
        if (this.products[collectionId]) {
            this.products[collectionId].unlocked = true;
            console.log(`🔓 Colección desbloqueada: ${this.products[collectionId].name}`);
            
            // Lanzar campaña de marketing automáticamente
            this.launchMarketingCampaign(collectionId);
            
            return {
                success: true,
                collectionName: this.products[collectionId].name,
                products: this.products[collectionId].products
            };
        }
        
        return { success: false, error: 'Colección no encontrada' };
    }
}

// Función para mostrar notificaciones de ventas
function showSalesNotification(productName, price) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="text-xl">💰</span>
            <div>
                <div class="font-bold">Venta Realizada!</div>
                <div class="text-sm">${productName} - €${price}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animar salida
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para actualizar estadísticas en la UI
function updateStatsUI(stats) {
    const statsElements = document.querySelectorAll('[data-stat]');
    statsElements.forEach(element => {
        const statType = element.getAttribute('data-stat');
        if (stats[statType]) {
            element.textContent = typeof stats[statType] === 'number' 
                ? stats[statType].toFixed(2) 
                : stats[statType];
        }
    });
}

// Inicializar la integración cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.printfulIntegration = new PrintfulIntegration();
    
    // Simular ventas periódicas para demostración
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% de probabilidad cada 10 segundos
            const products = [
                { name: 'Ocean Guardian T-Shirt', price: 24.99 },
                { name: 'Mountain Explorer Hoodie', price: 39.99 },
                { name: 'Future Innovator Cap', price: 19.99 }
            ];
            
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            showSalesNotification(randomProduct.name, randomProduct.price);
            
            // Actualizar estadísticas
            const stats = window.printfulIntegration.getSalesStats();
            updateStatsUI(stats);
        }
    }, 10000);
});

// Exportar para uso global
window.PrintfulIntegration = PrintfulIntegration;