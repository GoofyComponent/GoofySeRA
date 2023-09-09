import Axios from "axios";
import Cookies from "universal-cookie";

import { toast } from "@/components/ui/use-toast";
import { reset } from "@/helpers/slices/AppSlice";
import store from "@/helpers/store";

import { router } from "./routes";

Axios.defaults.withCredentials = true;

const cookies = new Cookies();

export const axios = Axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "X-XSRF-TOKEN": cookies.get("XSRF-TOKEN"),
    Accept: "application/json",
  },
});

axios.interceptors.request.use(
  async function (config) {
    if (!hasXSRFToken()) {
      await requestCSRFToken();
    }

    config.headers["X-XSRF-TOKEN"] = cookies.get("XSRF-TOKEN");

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

    let errormessage = "";

    if (error.message) {
      /* store.dispatch(reset());
      router.navigate("/login"); */
      errormessage = error.message;
    }

    if (error.response && error.response.data && error.response.data.message) {
      errormessage = error.response.data.message;
    }

    if (error.response && error.response.data && error.response.data.errors) {
      errormessage = error.response.data.errors;
    }

    if (error.response && error.response.data && error.response.data.error) {
      errormessage = error.response.data.error;
    }

    toast({
      title: "A error occured.",
      description: `${errormessage}`,
    });

    if (
      error.response &&
      error.response.status === 419 &&
      !originalRequest._retry
    ) {
      store.dispatch(reset());
      originalRequest._retry = true;
      await requestCSRFToken();
      return axios(originalRequest);
    }

    if (error.response && error.response.status === 401) {
      store.dispatch(reset());
      cookies.remove("XSRF-TOKEN");
      cookies.remove("laravel_session");
      router.navigate("/login");
    }
    if (error.response && error.response.status === 500) {
      router.navigate("/404");
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
