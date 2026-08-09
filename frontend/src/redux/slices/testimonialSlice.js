import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Public callers pass { approved: 'true' } to only get approved testimonials;
// the admin dashboard calls with no params to see everything (pending included).
export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/testimonials', { params });
      return response.data.testimonials;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch testimonials');
    }
  }
);

export const createTestimonial = createAsyncThunk(
  'testimonials/createTestimonial',
  async (testimonialData, { rejectWithValue }) => {
    try {
      const response = await api.post('/testimonials', testimonialData);
      return response.data.testimonial;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create testimonial');
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  'testimonials/updateTestimonial',
  async ({ id, testimonialData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/testimonials/${id}`, testimonialData);
      return response.data.testimonial;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update testimonial');
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  'testimonials/deleteTestimonial',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/testimonials/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete testimonial');
    }
  }
);

export const approveTestimonial = createAsyncThunk(
  'testimonials/approveTestimonial',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/testimonials/${id}/approve`);
      return response.data.testimonial;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve testimonial');
    }
  }
);

// There's no dedicated "unapprove" endpoint — the generic update endpoint
// accepts a partial body and applies it with findByIdAndUpdate, so setting
// { approved: false } through it is the correct, already-supported way to
// revoke approval without adding a new backend route.
export const unapproveTestimonial = createAsyncThunk(
  'testimonials/unapproveTestimonial',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/testimonials/${id}`, { approved: false });
      return response.data.testimonial;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unapprove testimonial');
    }
  }
);

const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState: {
    testimonials: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.testimonials.unshift(action.payload);
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        const index = state.testimonials.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.testimonials[index] = action.payload;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter((t) => t._id !== action.payload);
      })
      .addCase(approveTestimonial.fulfilled, (state, action) => {
        const index = state.testimonials.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.testimonials[index] = action.payload;
      })
      .addCase(unapproveTestimonial.fulfilled, (state, action) => {
        const index = state.testimonials.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.testimonials[index] = action.payload;
      });
  }
});

export const { clearError } = testimonialSlice.actions;
export default testimonialSlice.reducer;
