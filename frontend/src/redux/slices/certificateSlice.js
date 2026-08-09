import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Certificates are created/updated as multipart form data (they always
// carry an image file). Building the FormData here keeps that detail out
// of the UI components — they just pass a plain object with an optional
// `image` File.
const toFormData = (certificateData) => {
  const formData = new FormData();
  Object.entries(certificateData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'tags' && Array.isArray(value)) {
      formData.append('tags', JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

// Overriding Content-Type to undefined lets the browser set
// "multipart/form-data; boundary=..." itself — the api instance's default
// "application/json" header would otherwise strip the boundary and the
// server could never parse the upload.
const multipartConfig = { headers: { 'Content-Type': undefined } };

// Async thunks
export const fetchCertificates = createAsyncThunk(
  'certificates/fetchCertificates',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/certificates', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificates');
    }
  }
);

export const fetchCertificate = createAsyncThunk(
  'certificates/fetchCertificate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/certificates/${id}`);
      return response.data.certificate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificate');
    }
  }
);

export const fetchAllCertificatesAdmin = createAsyncThunk(
  'certificates/fetchAllCertificatesAdmin',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/certificates/admin/all', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificates');
    }
  }
);

export const createCertificate = createAsyncThunk(
  'certificates/createCertificate',
  async (certificateData, { rejectWithValue }) => {
    try {
      const response = await api.post('/certificates', toFormData(certificateData), multipartConfig);
      return response.data.certificate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create certificate');
    }
  }
);

export const updateCertificate = createAsyncThunk(
  'certificates/updateCertificate',
  async ({ id, certificateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/certificates/${id}`, toFormData(certificateData), multipartConfig);
      return response.data.certificate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update certificate');
    }
  }
);

export const deleteCertificate = createAsyncThunk(
  'certificates/deleteCertificate',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/certificates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete certificate');
    }
  }
);

export const updateCertificateStatus = createAsyncThunk(
  'certificates/updateCertificateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/certificates/${id}/status`, { status });
      return response.data.certificate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const reorderCertificates = createAsyncThunk(
  'certificates/reorderCertificates',
  async (orderedList, { rejectWithValue }) => {
    // orderedList: [{ id, displayOrder }, ...]
    try {
      const response = await api.patch('/certificates/reorder', { certificates: orderedList });
      return response.data.certificates;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reorder certificates');
    }
  }
);

const certificateSlice = createSlice({
  name: 'certificates',
  initialState: {
    certificates: [],       // public gallery list
    adminCertificates: [],  // full list (all statuses) for the dashboard
    currentCertificate: null,
    loading: false,
    adminLoading: false,
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
    },
    clearCurrentCertificate: (state) => {
      state.currentCertificate = null;
    },
    // Optimistic local reorder for a smooth drag-and-drop UI — the thunk
    // above persists it; this just keeps the on-screen order in sync while
    // that request is in flight.
    reorderLocally: (state, action) => {
      state.adminCertificates = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Certificates (public)
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.certificates;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total
        };
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Certificate
      .addCase(fetchCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCertificate = action.payload;
      })
      .addCase(fetchCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin: fetch all
      .addCase(fetchAllCertificatesAdmin.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCertificatesAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminCertificates = action.payload.certificates;
      })
      .addCase(fetchAllCertificatesAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCertificate.fulfilled, (state, action) => {
        state.adminCertificates.unshift(action.payload);
      })
      // Update
      .addCase(updateCertificate.fulfilled, (state, action) => {
        const adminIndex = state.adminCertificates.findIndex((c) => c._id === action.payload._id);
        if (adminIndex !== -1) state.adminCertificates[adminIndex] = action.payload;
        const publicIndex = state.certificates.findIndex((c) => c._id === action.payload._id);
        if (publicIndex !== -1) state.certificates[publicIndex] = action.payload;
      })
      // Delete
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.adminCertificates = state.adminCertificates.filter((c) => c._id !== action.payload);
        state.certificates = state.certificates.filter((c) => c._id !== action.payload);
      })
      // Status toggle
      .addCase(updateCertificateStatus.fulfilled, (state, action) => {
        const index = state.adminCertificates.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.adminCertificates[index] = action.payload;
      })
      // Reorder
      .addCase(reorderCertificates.fulfilled, (state, action) => {
        action.payload.forEach((updated) => {
          const index = state.adminCertificates.findIndex((c) => c._id === updated._id);
          if (index !== -1) state.adminCertificates[index] = updated;
        });
      });
  }
});

export const { clearError, clearCurrentCertificate, reorderLocally } = certificateSlice.actions;
export default certificateSlice.reducer;
