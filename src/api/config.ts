import axios from "axios";


const Url = 'https://enrgy-be-development.up.railway.app/api/';

const axiosInstance = axios.create({
  baseURL: Url,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.defaults.withCredentials = true;


export default axiosInstance;
export const apiUrl = Url;
