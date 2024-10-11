import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_IP;


const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
});

export default api;
