import axios from 'axios';
import {authenticationInterceptor} from "@/domains/IAM/services/authentication.interceptor.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

http.defaults.headers.common['Content-Type'] = 'application/json';
http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

http.interceptors.request.use(
    authenticationInterceptor,
    error => Promise.reject(error)
);


http.interceptors.request.use(
    authenticationInterceptor,
    error => Promise.reject(error)
);


export default http;