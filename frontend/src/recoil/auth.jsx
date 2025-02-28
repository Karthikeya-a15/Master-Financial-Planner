import { atom } from 'recoil';

// Check if token exists in localStorage
const token = localStorage.getItem('token');

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: !!token,
    token: token || null,
    user: null,
    loading: false,
    error: null
  }
});