'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  theme: 'dark' | 'light' | 'system';
}

const initialState: ThemeState = {
  theme: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'dark' | 'light' | 'system'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
