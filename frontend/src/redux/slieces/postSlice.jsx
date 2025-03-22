import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor"; 
import { checkLikesForPosts } from "../slieces/likeSlise"

const API_URL = import.meta.env.VITE_API_URL;

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`${API_URL}/posts`);
      if (response.data.error) {
        return rejectWithValue(response.data.error);
      }
      const posts = response.data.posts;
      const postIds = posts.map(post => post._id);
      dispatch(checkLikesForPosts(postIds));
      return posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/posts/oneuser/${userId}`);
      if (response.data.error) {
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
  async (postId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`${API_URL}/posts/onepost/${postId}`);
      if (response.data.error) {
        return rejectWithValue(response.data.error);
      }
      dispatch(checkLikesForPosts([postId]));
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

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/posts/${postId}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ошибка при обновлении поста");
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
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        state.posts = state.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        state.userPosts = state.userPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default allPostsSlice.reducer;
