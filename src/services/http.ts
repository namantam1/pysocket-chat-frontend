import axios, { AxiosInstance } from "axios";

export const BASE_URL = "https://sleepy-stream-26298.herokuapp.com";

function getAccessToken() {
  return localStorage.getItem("access");
}

function getRefreshToken() {
  return localStorage.getItem("refresh");
}

const instance = axios.create({
  baseURL: BASE_URL,
  params: {},
  timeout: 20000,
  headers: {
    "content-type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  const token = getAccessToken();
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

function createAxiosResponseInterceptor(axiosInstance: AxiosInstance) {
  const interceptor = axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error?.response?.status === 403
        // error.response.config?.url !== "/api/login/"
      ) {
        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response
         */
        axiosInstance.interceptors.response.eject(interceptor);

        return axiosInstance
          .post("/api/token_refresh/", { refresh: getRefreshToken() })
          .then((response) => {
            // SET ACCESS TOKEN
            const { access } = response.data;
            localStorage.setItem("access", access);
            error.response.config.headers["authorization"] = "Bearer " + access;
            return axiosInstance(error.response.config);
          })
          .catch((error) => {
            localStorage.clear();
            // window.location.reload();
            return Promise.reject(error);
          })
          .finally(() => createAxiosResponseInterceptor(axiosInstance));
      }
      return Promise.reject(error);
    }
  );
}

createAxiosResponseInterceptor(instance);

export { instance as myaxios };
