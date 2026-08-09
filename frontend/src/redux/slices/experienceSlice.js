import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchExperiences = createAsyncThunk(
  'experience/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/experience');
      return response.data.experiences;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch experience');
    }
  }
);

export const createExperience = createAsyncThunk(
  'experience/createExperience',
  async (experienceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/experience', experienceData);
      return response.data.experience;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create experience entry');
    }
  }
);

export const updateExperience = createAsyncThunk(
  'experience/updateExperience',
  async ({ id, experienceData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/experience/${id}`, experienceData);
      return response.data.experience;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update experience entry');
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'experience/deleteExperience',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/experience/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete experience entry');
    }
  }
);

const experienceSlice = createSlice({
  name: 'experience',
  initialState: {
    experiences: [],
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
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.experiences.unshift(action.payload);
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.experiences.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state.experiences[index] = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter((e) => e._id !== action.payload);
      });
  }
});

export const { clearError } = experienceSlice.actions;
export default experienceSlice.reducer;
