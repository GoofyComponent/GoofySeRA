import Axios from "axios";
import Cookies from "universal-cookie";

import { reset } from "@/helpers/slices/AppSlice";
import store from "@/helpers/store";

Axios.defaults.withCredentials = true;

const cookies = new Cookies();

export const axios = Axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  timeout: 1000,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  async function (config) {
    if (!hasXSRFToken()) {
      await requestCSRFToken();
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 419 && !originalRequest._retry) {
      store.dispatch(reset());
      originalRequest._retry = true;
      await requestCSRFToken();
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export function hasXSRFToken() {
  const xsrfToken = cookies.get("XSRF-TOKEN");
  return !!xsrfToken;
}

async function requestCSRFToken() {
  return await Axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/sanctum/csrf-cookie`
  );
}
