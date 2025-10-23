import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

let accessToken: string | null = null;
const baseUrl = "http://localhost:8000/api/";
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};
export const getAccessToken = (): string | null => accessToken;

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};
export const getCSRFToken = (): string | null => getCookie("csrftoken");

const ApiRequest = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const PublicApiRequest = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

// 🚀 Interceptor de requisição
ApiRequest.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const logOut = async () => {
  try {
    const csrf = getCSRFToken();
    await ApiRequest.post(
      "logout/",
      {}, // corpo vazio
      {
        headers: {
          "X-CSRFToken": csrf || "",
        },
      }
    );
  } catch (err) {
    // console.error("❌ Erro ao fazer logout:", err);
  } finally {
    setAccessToken(null);
  }
};

ApiRequest.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se não há resposta (ex: sem internet)
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const isRefreshEndpoint = originalRequest.url?.includes("/token/refresh/");

    // Evita loop infinito: nunca tenta renovar se o erro for no próprio /token/refresh/
    if (isRefreshEndpoint) {
      // console.warn("⚠️ Erro no endpoint de refresh, logout forçado.");
      setAccessToken(null);
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const hasRefreshCookie = !!getCookie("csrftoken");
      if (!hasRefreshCookie) {
        // console.warn("Nenhum refresh_token encontrado, logout automático.");
        setAccessToken(null);
        return Promise.reject(error);
      }

      try {
        const csrf = getCSRFToken();

        const { data } = await ApiRequest.post(
          "/token/refresh/",
          {},
          { headers: { "X-CSRFToken": csrf || "" } }
        );

        // Atualiza token e reenvia requisição
        setAccessToken(data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return ApiRequest(originalRequest);
      } catch (refreshError) {
        // console.warn("⚠️ Falha ao renovar token:", refreshError);
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const fetchCSRFToken = async (): Promise<void> => {
  try {
    await ApiRequest.get("get-csrf-token/");
  } catch (error) {
    console.error("❌ Falha ao buscar CSRF token:", error);
  }
};

const Api = {
  ApiRequest: ApiRequest,
  PublicApiRequest: PublicApiRequest,
};
export default Api;
