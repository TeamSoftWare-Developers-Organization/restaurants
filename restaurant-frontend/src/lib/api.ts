import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                try {
                    const { state } = JSON.parse(authStorage);
                    if (state?.token) {
                        config.headers.Authorization = `Bearer ${state.token}`;
                    }
                } catch (e) {
                    console.error('Error parsing auth-storage', e);
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error (logout or refresh token)
            // For now, we'll just let the store handle it if needed
        }
        return Promise.reject(error);
    }
);

export default api;
