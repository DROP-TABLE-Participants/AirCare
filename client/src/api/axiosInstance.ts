import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-aircare.dressr.fashion'}/api/v1/Predict`,

    headers: {
      'Content-Type': 'application/json',
    },
  });

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;