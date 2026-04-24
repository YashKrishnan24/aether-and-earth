import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
//url link to backend auth routes, adjust as needed for production
const API_URL = 'http://localhost:5000/api/auth';

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('authUser');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/signup`, credentials);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, credentials);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.put(`${API_URL}/update-profile`, profileData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      localStorage.setItem('authUser', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const addShippingAddress = createAsyncThunk(
  'auth/addShippingAddress',
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.post(`${API_URL}/add-shipping-address`, addressData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add address');
    }
  }
);

export const removeShippingAddress = createAsyncThunk(
  'auth/removeShippingAddress',
  async (addressId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.delete(`${API_URL}/remove-shipping-address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove address');
    }
  }
);

export const addPaymentMethod = createAsyncThunk(
  'auth/addPaymentMethod',
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.post(`${API_URL}/add-payment-method`, paymentData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add payment method');
    }
  }
);

export const removePaymentMethod = createAsyncThunk(
  'auth/removePaymentMethod',
  async (methodId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.delete(`${API_URL}/remove-payment-method/${methodId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove payment method');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
  
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
 
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
 
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
  
    builder.addCase(addShippingAddress.fulfilled, (state, action) => {
      state.user.shippingAddresses = action.payload.shippingAddresses;
    });
 
    builder.addCase(removeShippingAddress.fulfilled, (state, action) => {
      state.user.shippingAddresses = action.payload.shippingAddresses;
    });
   
    builder.addCase(addPaymentMethod.fulfilled, (state, action) => {
      state.user.paymentMethods = action.payload.paymentMethods;
    });
  
    builder.addCase(removePaymentMethod.fulfilled, (state, action) => {
      state.user.paymentMethods = action.payload.paymentMethods;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
