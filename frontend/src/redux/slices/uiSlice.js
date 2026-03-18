import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  showModal: false,
  modalType: null,
  showSidebar: false,
  theme: localStorage.getItem('theme') || 'light',
  notification: {
    show: false,
    type: 'info',
    message: '',
    duration: 3000
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    openModal: (state, action) => {
      state.showModal = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.showModal = false;
      state.modalType = null;
      state.modalData = null;
    },
    showNotification: (state, action) => {
      state.notification = {
        show: true,
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 3000
      };
    },
    hideNotification: (state) => {
      state.notification.show = false;
    },
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    setSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    }
  }
});

export const {
  setLoading,
  openModal,
  closeModal,
  showNotification,
  hideNotification,
  toggleSidebar,
  setSidebar,
  toggleTheme,
  setTheme
} = uiSlice.actions;

export default uiSlice.reducer;
