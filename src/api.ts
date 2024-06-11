import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BASE_URL || 'http://127.0.0.1:8000/api/',
});

export default api;