import axios from 'axios';
import {authenticationInterceptor} from "@/domains/IAM/services/authentication.interceptor.js";

// Usar URL absoluta en producción
const isProduction = import.meta.env.PROD;
const baseURL = isProduction
    ? 'https://calfinapp.azurewebsites.net/api/v1'
    : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const http = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000, // 10 segundos de timeout
    withCredentials: false // Importante para CORS
});

// Configurar headers por defecto
http.defaults.headers.common['Content-Type'] = 'application/json';
http.defaults.headers.common['Accept'] = 'application/json';

// Interceptor de request (solo uno)
http.interceptors.request.use(
    authenticationInterceptor,
    error => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores
http.interceptors.response.use(
    response => response,
    error => {
        console.error('HTTP Error:', error);
        if (error.code === 'ENOTFOUND' || error.code === 'ERR_NETWORK') {
            console.error('Error de red o servidor no encontrado');
        }
        return Promise.reject(error);
    }
);


export default http;