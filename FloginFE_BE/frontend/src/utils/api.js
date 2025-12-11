import axios from 'axios'
import {getJWTfromCookie} from "./cookie";

export const api = axios.create({
    baseURL: "https://cdassignment2-production.up.railway.app/",
    withCredentials: true,
})
export const apiWithAuth = axios.create({
    baseURL: "https://cdassignment2-production.up.railway.app/",
    withCredentials: true,
});

apiWithAuth.interceptors.request.use(
    (config) => {
        const token = getJWTfromCookie();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);