import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proffy-backend.herokuapp.com',
});

export default api;
