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


export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("Fetching posts for userId:", userId);
      const response = await api.get(`${API_URL}/posts/oneuser/${userId}`);
      console.log("Posts response:", response.data);

      if (response.data.error) {
        console.error("Error fetching posts:", error);
        return rejectWithValue(response.data.error);
      }

      return response.data;
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


export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/posts/${postId}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ошибка при удалении поста");
    }
  }
);

const allPostsSlice = createSlice({
  name: "allPosts",
  initialState: {
    posts: [],
    userPosts: [],
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

     
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
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
      })

      
      .addCase(deletePost.fulfilled, (state, action) => {
       
        state.posts = state.posts.filter((post) => post._id !== action.payload._id);
        state.userPosts = state.userPosts.filter((post) => post._id !== action.payload._id);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default allPostsSlice.reducer;