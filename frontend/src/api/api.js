import axios from 'axios';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../utils/token'
import { useNavigate } from 'react-router-dom';
import {BASE_URL} from '../utils/token'

const api = axios.create({
  baseURL: BASE_URL,
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const navigate = useNavigate();

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
                    refresh: refreshToken,
                });

                localStorage.setItem(ACCESS_TOKEN, data.access);

                api.defaults.headers['Authorization'] = `Bearer ${data.access}`;
                originalRequest.headers['Authorization'] = `Bearer ${data.access}`;

                return api(originalRequest);
            } catch (error) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                navigate('/login');
            }
        } else if (error.response.status === 403) {
            console.error('403 Forbidden: ', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default api;