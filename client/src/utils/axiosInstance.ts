import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 401) {
      const { data } = await axios.post("/refresh", {}, { withCredentials: true });
      localStorage.setItem("accessToken", data.accessToken);
      err.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return axios(err.config);
    }
    return Promise.reject(err);
  }
);

export { axiosInstance };
