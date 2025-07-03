import axios from 'axios';
import {authenticationInterceptor} from "@/domains/IAM/services/authentication.interceptor.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
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