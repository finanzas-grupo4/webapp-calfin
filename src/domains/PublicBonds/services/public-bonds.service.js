// src/domains/PublicBonds/services/public-bonds.service.js
import http from '@/shared/services/http-common.js';

class PublicBondsService {
    async getAllBonds() {
        try {
            console.log('Solicitando bonos públicos...');
            // Usar http en lugar de axios directo para incluir interceptores
            const response = await http.get('/bonds/all-bonds');
            console.log('Bonos recibidos:', response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error al obtener bonos públicos:', error);
            return {
                success: false,
                message: 'No se pudieron cargar los bonos',
                error
            };
        }
    }
}

export default new PublicBondsService();