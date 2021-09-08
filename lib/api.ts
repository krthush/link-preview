import axios, { AxiosRequestConfig } from 'axios';
import { baseUrl } from '../utils';

// For server side set baseURL to VERCEL_URL with https if in production, or LOCAL_URL loaded from env if in development/local
// For client side defaults to /api

const api = axios.create({
  baseURL: baseUrl + "/api"
});

export default api;