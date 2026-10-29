import { configureStore } from '@reduxjs/toolkit';
import { bookingApi } from '../services/bookingApi';

export const store = configureStore({
  reducer: {
    [bookingApi.reducerPath]: bookingApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(bookingApi.middleware),
});
