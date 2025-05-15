import axios from "axios";
import store from "../store";

const API_URL = import.meta.env.SERVER_URL ? import.meta.env.SERVER_URL : "http://localhost:5000";

const authApi = axios.create({
  baseURL: `${API_URL}/api/v1`
});

authApi.interceptors.request.use(
  function (config) {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 403 && data?.error === 40304) {
        console.warn('Token is invalid or expired. Redirecting to login...');
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  },
);

export default authApi;