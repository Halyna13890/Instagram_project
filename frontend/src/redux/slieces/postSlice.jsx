import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor";

const API_URL = import.meta.env.VITE_API_URL;


export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/posts`);

      if (response.data.error) {
        return rejectWithValue(response.data.error);
      }

      return response.data.posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchOnePost = createAsyncThunk(
  "posts/fetchOnePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/posts/onepost/${postId}`);

      if (response.data.error) {
        return rejectWithValue(response.data.error);
      }

      return response.data.post; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const allPostsSlice = createSlice({
  name: "allPosts",
  initialState: {
    posts: [],
    singlePost: null, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

     
      .addCase(fetchOnePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnePost.fulfilled, (state, action) => {
        state.singlePost = action.payload; 
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchOnePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default allPostsSlice.reducer;
