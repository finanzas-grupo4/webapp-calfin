import axios from 'axios';
import Cookies from 'js-cookie';

export function authenticationInterceptor(config) {
  const getToken = () => localStorage.getItem('token');

  if (config && config.url && config.url.includes('/authentication/')) {
    return config;
  }

  const token = getToken();
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}