import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const trackVisitor = createAsyncThunk(
  'analytics/trackVisitor',
  async (visitorData, { rejectWithValue }) => {
    try {
      const response = await api.post('/analytics/track', visitorData);
      return response.data;
    } catch (error) {
      // Don't reject tracking errors - they shouldn't block the UI
      return null;
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchVisitors = createAsyncThunk(
  'analytics/fetchVisitors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/visitors', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visitors');
    }
  }
);

export const updateDuration = createAsyncThunk(
  'analytics/updateDuration',
  async ({ visitorId, duration }, { rejectWithValue }) => {
    try {
      const response = await api.put('/analytics/duration', { visitorId, duration });
      return response.data;
    } catch (error) {
      return null;
    }
  }
);

// Slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    stats: null,
    visitors: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pages: 1,
      total: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Track Visitor
      .addCase(trackVisitor.fulfilled, () => {
        // Silent success - no state update needed
      })
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Visitors
      .addCase(fetchVisitors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.loading = false;
        state.visitors = action.payload.visitors;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total
        };
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
