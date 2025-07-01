import http from "../../shared/services/http-common.js";

export class CalculatorService {
    resourceEndpoint = '/api/v1/bonds';

    // Crear un nuevo bono
    createBond(bondResource) {
        return http.post(`${this.resourceEndpoint}/create-bonds`, bondResource);
    }

    // Obtener un bono por su ID
    getBondById(bondId) {
        return http.get(`${this.resourceEndpoint}/${bondId}`);
    }

    // Obtener todos los bonos de un usuario
    getBondsByUser(userId) {
        return http.get(`${this.resourceEndpoint}/users/${userId}/bonds`);
    }

    // Obtener los flujos de caja de un bono
    getBondCashflows(bondId) {
        return http.get(`${this.resourceEndpoint}/bonds/${bondId}/cashflows`);
    }

    // Obtener todos los bonos
    getAllBonds() {
        return http.get(`${this.resourceEndpoint}/all-bonds`);
    }
}

