import axios from 'axios';
import { config } from 'process';

export const api = axios.create({
    baseURL:'https://localhost:3000/api',
});

api.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
