// src/api/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🔐 Intercepteur requête
 * Ajoute automatiquement le token JWT
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🚨 Intercepteur réponse
 * Gère 401 / 403 globalement
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      if (status === 403) {
        console.warn(" Accès refusé (403)");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
