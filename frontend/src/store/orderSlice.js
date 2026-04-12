import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orderHistory: [],
  },
  reducers: {
    addOrder: (state, action) => {
      // Adds the new order to the beginning of the array
      state.orderHistory.unshift(action.payload);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;