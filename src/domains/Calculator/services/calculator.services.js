import http from "@/shared/services/http-common.js";

class CalculatorService {
    resourceEndpoint = '/bonds';

    // Crear un nuevo bono
    async createBond(bondData) {
        console.log('CalculatorService - Enviando datos del bono:', bondData);
        console.log(`URL completa: ${import.meta.env.VITE_API_BASE_URL}${this.resourceEndpoint}/create-bonds`);

        try {
            const response = await http.post(`${this.resourceEndpoint}/create-bonds`, bondData);
            console.log('Respuesta del servidor (createBond):', response);

            if (response.status === 200 || response.status === 201) {
                console.log('Bono agregado correctamente. Status:', response.status);
                return {
                    success: true,
                    data: response.data,
                    message: 'Bono agregado correctamente'
                };
            } else {
                console.warn('Respuesta inesperada del servidor:', response.status);
                return {
                    success: false,
                    message: `Respuesta inesperada del servidor: ${response.status}`
                };
            }
        } catch (error) {
            console.error('Error al crear el bono:', error);

            if (error.response) {
                console.error('Código de error:', error.response.status);
                console.error('Datos de error:', error.response.data);
                return {
                    success: false,
                    message: `Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`
                };
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor');
                return {
                    success: false,
                    message: 'No se recibió respuesta del servidor'
                };
            } else {
                console.error('Error de configuración:', error.message);
                return {
                    success: false,
                    message: `Error de configuración: ${error.message}`
                };
            }
        }
    }

    // Obtener un bono por su ID
    async getBondById(bondId) {
        console.log(`CalculatorService - Solicitando bono con ID: ${bondId}`);
        console.log(`URL completa: ${import.meta.env.VITE_API_BASE_URL}${this.resourceEndpoint}/${bondId}`);

        try {
            const response = await http.get(`${this.resourceEndpoint}/${bondId}`);
            console.log('Respuesta del servidor (getBondById):', response);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error(`Error al obtener bono ID ${bondId}:`, error);
            return this._handleError(error, 'Error al obtener detalles del bono');
        }
    }

    // Obtener todos los bonos de un usuario
    async getBondsByUser(userId) {
        console.log(`CalculatorService - Solicitando bonos del usuario: ${userId}`);
        console.log(`URL completa: ${import.meta.env.VITE_API_BASE_URL}${this.resourceEndpoint}/users/${userId}/bonds`);

        try {
            const response = await http.get(`${this.resourceEndpoint}/users/${userId}/bonds`);
            console.log('Respuesta del servidor (getBondsByUser):', response);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error(`Error al obtener bonos del usuario ${userId}:`, error);
            return this._handleError(error, 'Error al obtener bonos del usuario');
        }
    }

    // Obtener los flujos de caja de un bono
    async getBondCashflows(bondId) {
        console.log(`CalculatorService - Solicitando flujos de caja del bono: ${bondId}`);
        console.log(`URL completa: ${import.meta.env.VITE_API_BASE_URL}${this.resourceEndpoint}/bonds/${bondId}/cashflows`);

        try {
            const response = await http.get(`${this.resourceEndpoint}/bonds/${bondId}/cashflows`);
            console.log('Respuesta del servidor (getBondCashflows):', response);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error(`Error al obtener flujos de caja del bono ${bondId}:`, error);
            return this._handleError(error, 'Error al obtener flujos de caja');
        }
    }

    // Obtener todos los bonos
    async getAllBonds() {
        console.log('CalculatorService - Solicitando todos los bonos');
        console.log(`URL completa: ${import.meta.env.VITE_API_BASE_URL}${this.resourceEndpoint}/all-bonds`);

        try {
            const response = await http.get(`${this.resourceEndpoint}/all-bonds`);
            console.log('Respuesta del servidor (getAllBonds):', response);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error al obtener todos los bonos:', error);
            return this._handleError(error, 'Error al obtener todos los bonos');
        }
    }

    // Actualizar un bono
    async updateBond(bondId, bondData) {
        console.log(`CalculatorService - Actualizando bono ID ${bondId}:`, bondData);
        console.log(`URL completa: ${import.meta.env.VITE_API_BASE_URL}${this.resourceEndpoint}/${bondId}/update-bond`);

        try {
            const response = await http.put(`${this.resourceEndpoint}/${bondId}/update-bond`, bondData);
            console.log('Respuesta del servidor (updateBond):', response);
            return {
                success: true,
                data: response.data,
                message: 'Bono actualizado correctamente'
            };
        } catch (error) {
            console.error(`Error al actualizar bono ID ${bondId}:`, error);
            return this._handleError(error, 'Error al actualizar el bono');
        }
    }

    // Eliminar un bono
    async deleteBond(bondId) {
        console.log(`CalculatorService - Eliminando bono ID: ${bondId}`);
        console.log(`URL completa: ${import.meta.env.VITE_API_BASE_URL}${this.resourceEndpoint}/${bondId}/delete-bond`);

        try {
            const response = await http.delete(`${this.resourceEndpoint}/${bondId}/delete-bond`);
            console.log('Respuesta del servidor (deleteBond):', response);
            return {
                success: true,
                data: response.data,
                message: 'Bono eliminado correctamente'
            };
        } catch (error) {
            console.error(`Error al eliminar bono ID ${bondId}:`, error);
            return this._handleError(error, 'Error al eliminar el bono');
        }
    }

    // Método auxiliar para manejar errores
    _handleError(error, defaultMessage) {
        if (error.response) {
            console.error('Código de error:', error.response.status);
            console.error('Datos de error:', error.response.data);
            return {
                success: false,
                message: `Error ${error.response.status}: ${error.response.data?.message || defaultMessage}`
            };
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor');
            return {
                success: false,
                message: 'No se recibió respuesta del servidor'
            };
        } else {
            console.error('Error de configuración:', error.message);
            return {
                success: false,
                message: `Error de configuración: ${error.message}`
            };
        }
    }
}

export default new CalculatorService();

