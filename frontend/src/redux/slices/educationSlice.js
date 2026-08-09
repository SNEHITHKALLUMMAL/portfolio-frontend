import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchEducation = createAsyncThunk(
  'education/fetchEducation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/education');
      return response.data.education;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch education');
    }
  }
);

export const createEducation = createAsyncThunk(
  'education/createEducation',
  async (educationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/education', educationData);
      return response.data.education;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create education entry');
    }
  }
);

export const updateEducation = createAsyncThunk(
  'education/updateEducation',
  async ({ id, educationData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/education/${id}`, educationData);
      return response.data.education;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update education entry');
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'education/deleteEducation',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/education/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete education entry');
    }
  }
);

const educationSlice = createSlice({
  name: 'education',
  initialState: {
    education: [],
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
      .addCase(fetchEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.education.unshift(action.payload);
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        const index = state.education.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state.education[index] = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.education = state.education.filter((e) => e._id !== action.payload);
      });
  }
});

export const { clearError } = educationSlice.actions;
export default educationSlice.reducer;
