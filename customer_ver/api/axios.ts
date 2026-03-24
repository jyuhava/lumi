import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:8000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper aman untuk Token
export const setToken = async (token: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('mobile_user_token', token);
  } else {
    await SecureStore.setItemAsync('mobile_user_token', token);
  }
};

export const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('mobile_user_token');
  } else {
    return await SecureStore.getItemAsync('mobile_user_token');
  }
};

export const removeToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('mobile_user_token');
  } else {
    await SecureStore.deleteItemAsync('mobile_user_token');
  }
};

// Interceptor untuk menyisipkan Bearer token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Error getting token:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Jika Unauthorized, hapus token (Token expire dll)
    if (error.response && error.response.status === 401) {
      try {
        await removeToken();
      } catch (e) {
        console.log('Error removing token:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
