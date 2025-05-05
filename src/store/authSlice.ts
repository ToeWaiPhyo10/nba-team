'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState extends User {}

const initialState: AuthState = {
  username: '',
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isAuthenticated = true;
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify({ username: action.payload, isAuthenticated: true }));
    },
    logout: (state) => {
      state.username = '';
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    initializeAuth: (state) => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        state.username = user.username;
        state.isAuthenticated = user.isAuthenticated;
      }
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
