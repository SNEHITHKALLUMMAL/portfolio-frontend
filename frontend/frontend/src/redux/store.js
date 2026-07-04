import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import skillReducer from './slices/skillSlice';
import blogReducer from './slices/blogSlice';
import contactReducer from './slices/contactSlice';
import analyticsReducer from './slices/analyticsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    skills: skillReducer,
    blogs: blogReducer,
    contact: contactReducer,
    analytics: analyticsReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export default store;
