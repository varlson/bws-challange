// import axios from "axios";
// let accessToken: string | null = null;
// export const setAccessToken = (token: string | null) => {
//   accessToken = token;
// };

// export const getAccessToken = () => accessToken;

// const ApiRequest = axios.create({
//   baseURL: "http://localhost:8000/api/",
//   // baseURL: "https://focomail-server.vercel.app/api",
//   withCredentials: true, // IMPORTANTE: Envia cookies
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default ApiRequest;

// export const getCSRFToken = () => {
//   const name = "csrftoken";
//   const cookies = document.cookie.split(";");
//   for (const cookie of cookies) {
//     const [key, value] = cookie.trim().split("=");
//     if (key === name) return value;
//   }
//   return null;
// };

// ApiRequest.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   console.log("Token de acesso no interceptor:", token);
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// ApiRequest.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Lê o csrftoken do cookie
//         const csrf = getCookie("csrftoken");

//         const { data } = await ApiRequest.post(
//           "/token/refresh/",
//           {},
//           {
//             headers: { "X-CSRFToken": csrf },
//           }
//         );

//         // Atualiza token global
//         setAccessToken(data.access);

//         // Reenvia a requisição original
//         originalRequest.headers.Authorization = `Bearer ${data.access}`;
//         return ApiRequest(originalRequest);
//       } catch (err) {
//         setAccessToken(null);
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

/**
 * ================================
 * 🔐 Controle do Access Token
 * ================================
 */
let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

/**
 * ================================
 * 🍪 Funções utilitárias
 * ================================
 */
export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

export const getCSRFToken = (): string | null => getCookie("csrftoken");

/**
 * ================================
 * 🌐 Instância principal do Axios
 * ================================
 */
const ApiRequest = axios.create({
  baseURL: "http://localhost:8000/api/",
  // baseURL: "https://focomail-server.vercel.app/api",
  withCredentials: true, // ✅ Envia cookies (refresh_token, csrftoken)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ================================
 * 🚀 Interceptor de Requisição
 * ================================
 */
ApiRequest.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * ================================
 * 🔁 Interceptor de Resposta (auto refresh)
 * ================================
 */
ApiRequest.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se não há resposta do servidor (ex: offline)
    if (!error.response) {
      console.error("❌ Erro de rede:", error);
      return Promise.reject(error);
    }

    // Se o access token expirou e ainda não tentamos renovar
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const csrfToken = getCSRFToken();

        const { data } = await ApiRequest.post(
          "/token/refresh/",
          {},
          {
            headers: {
              "X-CSRFToken": csrfToken || "",
            },
          }
        );

        // Atualiza o token global
        setAccessToken(data.access);

        // Reenvia a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return ApiRequest(originalRequest);
      } catch (refreshError) {
        console.warn("⚠️ Falha ao renovar access token:", refreshError);
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    // Outros erros
    return Promise.reject(error);
  }
);

export default ApiRequest;
