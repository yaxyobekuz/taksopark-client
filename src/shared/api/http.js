// Axios
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Access token faqat xotirada (memory) saqlanadi - localStorage'da emas (XSS himoyasi).
// Sahifa yangilanganda yo'qoladi; bootstrapAuth() httpOnly refresh cookie orqali tiklaydi.
let accessToken = null;
const tokenListeners = new Set();

// token o'zgarishini kuzatuvchilar (guard/useAuth qayta render bo'lishi uchun)
export const onTokenChange = (cb) => {
  tokenListeners.add(cb);
  return () => tokenListeners.delete(cb);
};

export const setAccessToken = (token) => {
  accessToken = token || null;
  tokenListeners.forEach((cb) => cb());
};

export const getAccessToken = () => accessToken;

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required so the refresh httpOnly cookie is sent
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// On 401, attempt one refresh and replay the original request
let isRefreshing = false;
let waiters = [];

const flushWaiters = (token) => {
  waiters.forEach((cb) => cb(token));
  waiters = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const url = original.url || "";
    const skipRefreshFor = ["/auth/refresh", "/auth/login", "/auth/logout"];
    const isAuthRequest = skipRefreshFor.some((p) => url.includes(p));

    if (error.response?.status !== 401 || original._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // Another request is already refreshing; queue and wait for the new token
      return new Promise((resolve, reject) => {
        waiters.push((newToken) => {
          if (!newToken) return reject(error);
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(http(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const r = await http.post("/auth/refresh");
      const newToken = r.data?.data?.accessToken;
      if (!newToken) throw new Error("No access token in refresh response");
      setAccessToken(newToken);
      flushWaiters(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return http(original);
    } catch (e) {
      flushWaiters(null);
      setAccessToken(null);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

// App start'da bir marta chaqiriladi: httpOnly refresh cookie bo'lsa yangi access token oladi.
// Sessiya yo'q bo'lsa false qaytaradi (xato tashlamaydi).
export const bootstrapAuth = async () => {
  try {
    const r = await http.post("/auth/refresh");
    const token = r.data?.data?.accessToken;
    if (!token) return false;
    setAccessToken(token);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
};

export default http;
