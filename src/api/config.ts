import axios from "axios";

const Url = "https://enrgy-be-development.up.railway.app/api/";
// const Url = "http://localhost:3000/api/";

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

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => (token ? prom.resolve(token) : prom.reject(error)));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (error?.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest?.url?.includes("auth/refresh");
    if (isRefreshRequest) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.hash = "#/login";
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      localStorage.removeItem("access_token");
      window.location.hash = "#/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ success?: boolean; data?: { accessToken?: string; refreshToken?: string } }>(
        `${Url}auth/refresh`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
      const newAccessToken = data?.data?.accessToken;
      const newRefreshToken = data?.data?.refreshToken;
      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken);
        if (newRefreshToken) localStorage.setItem("refresh_token", newRefreshToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
      throw new Error("No token in refresh response");
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.hash = "#/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

axios.defaults.withCredentials = true;

export default axiosInstance;
export const apiUrl = Url;
