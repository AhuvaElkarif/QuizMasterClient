// import axios from 'axios';

// const baseURL = 'http://localhost:5000/api'//import.meta.url.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // Add request interceptor for auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for handling errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;