import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const sendContact = createAsyncThunk(
  'contact/sendContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const fetchContacts = createAsyncThunk(
  'contact/fetchContacts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contact/updateContactStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contact/${id}`, { status });
      return response.data.contact;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contact/deleteContact',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete contact');
    }
  }
);

// Slice
const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contacts: [],
    loading: false,
    error: null,
    success: false,
    pagination: {
      page: 1,
      pages: 1,
      total: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send Contact
      .addCase(sendContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendContact.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total
        };
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Contact Status
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      // Delete Contact
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c._id !== action.payload);
      });
  }
});

export const { clearError, clearSuccess } = contactSlice.actions;
export default contactSlice.reducer;
