// services/api/axiosInstance.ts
import axios from 'axios';

/**
 * Create and configure a new Axios instance.
 * 
 * NOTE: If you have environment variables for your API base URL,
 * e.g., NEXT_PUBLIC_API_BASE_URL, you can use them below.
 */

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com'}/api/v1/Predict`,
    // You can set default headers or other config options here.
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  });

/**
 * Optional: Add a request interceptor
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // For example, attach token if needed:
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

/**
 * Optional: Add a response interceptor
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // If you need to transform the data or handle specific status codes
    return response;
  },
  (error) => {
    // Handle response errors here
    // e.g., refresh token logic, show toast notifications, etc.
    return Promise.reject(error);
  }
);

export default axiosInstance;
