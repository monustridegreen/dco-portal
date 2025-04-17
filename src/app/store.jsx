import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../ features/rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.MODE !== 'production', // Vite's way to check environment
});

export default store;
