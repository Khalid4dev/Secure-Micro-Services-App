import axios from 'axios';
import keycloak from '../keycloak';

const api = axios.create({
    baseURL: 'http://localhost:9090/api', // Gateway URL
});

api.interceptors.request.use((config) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token might be expired or invalid
            // keycloak.login(); // Optional: Redirect to login or let the page handle it
        }
        return Promise.reject(error);
    }
);

export default api;
