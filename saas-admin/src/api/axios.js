import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8001/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('saas_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('saas_token');
        localStorage.removeItem('saas_user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;