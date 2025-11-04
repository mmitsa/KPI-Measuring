import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: true,
  language: (localStorage.getItem('language') as 'ar' | 'en') || 'ar',
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'ar' | 'en'>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setLanguage, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
