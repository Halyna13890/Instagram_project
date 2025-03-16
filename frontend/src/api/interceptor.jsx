import axios from "axios"; 
import Cookies from "js-cookie";
import store from "../redux/store";
import { logoutUser } from "../redux/slieces/authSlice"; 
import { useNavigate } from "react-router-dom";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = Cookies.get("auth_token");

        if (!token || error.response?.status === 401) {
            store.dispatch(logoutUser());
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
