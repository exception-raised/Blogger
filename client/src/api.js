import axios from 'axios';

const baseURL = 'http://165.227.150.236:5000'; 

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
