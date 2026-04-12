import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice'; // Add this import

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer, // Add this line
  },
});