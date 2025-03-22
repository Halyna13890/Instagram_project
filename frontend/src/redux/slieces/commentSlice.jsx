import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
     
      const response = await api.get(`${API_URL}/comment/all/${postId}`);

      if (response.data.error) {
        return rejectWithValue(response.data.error);
      }

      return response.data;
    } catch (error) {
     
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
   
    clearComments(state) {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
  
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
 
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
     
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
  },
});


export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;