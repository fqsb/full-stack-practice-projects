import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    if (!config.url.includes('/login') && !config.url.includes('/register')) {
      const token = localStorage.getItem('Logintoken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        window.location.href = '/login';
        return Promise.reject(new Error('Unauthorized, please log in first'));
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    if (response.data && response.data.message) {
      message.success(response.data.message);
      if (response.data.data !== undefined) {
        response.data = response.data.data;
      }
    }
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('Logintoken');
      window.location.href = '/login';
    }

    if (error.response && error.response.data && error.response.data.message) {
      message.error(error.response.data.message);
    } else {
      message.error(error.message || 'Network error');
    }

    return Promise.reject(error);
  }
);

export default request;
