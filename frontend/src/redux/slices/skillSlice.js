import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/skills', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
    }
  }
);

export const createSkill = createAsyncThunk(
  'skills/createSkill',
  async (skillData, { rejectWithValue }) => {
    try {
      const response = await api.post('/skills', skillData);
      return response.data.skill;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create skill');
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/updateSkill',
  async ({ id, skillData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/skills/${id}`, skillData);
      return response.data.skill;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update skill');
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/deleteSkill',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/skills/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete skill');
    }
  }
);

// Slice
const skillSlice = createSlice({
  name: 'skills',
  initialState: {
    skills: {},
    allSkills: [],
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
      // Fetch Skills
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload.skills || {};
        state.allSkills = action.payload.allSkills || [];
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Skill
      .addCase(createSkill.fulfilled, (state, action) => {
        state.allSkills.push(action.payload);
      })
      // Update Skill
      .addCase(updateSkill.fulfilled, (state, action) => {
        const index = state.allSkills.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.allSkills[index] = action.payload;
        }
      })
      // Delete Skill
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.allSkills = state.allSkills.filter(s => s._id !== action.payload);
      });
  }
});

export const { clearError } = skillSlice.actions;
export default skillSlice.reducer;
