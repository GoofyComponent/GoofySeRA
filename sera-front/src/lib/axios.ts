import Axios from "axios";
import Cookies from "universal-cookie";

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
    if (!isValidXSRFToken()) {
      await requestCSRFToken();
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function isValidXSRFToken() {
  const xsrfToken = cookies.get("XSRF-TOKEN");
  console.log(!!xsrfToken);
  return !!xsrfToken;
}

// Fonction pour demander un nouveau jeton CSRF
async function requestCSRFToken() {
  return await Axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/sanctum/csrf-cookie`
  );
}
