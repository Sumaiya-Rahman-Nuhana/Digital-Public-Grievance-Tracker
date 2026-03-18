import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token to every request automatically
instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;
