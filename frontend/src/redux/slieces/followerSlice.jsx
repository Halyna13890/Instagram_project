import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const checkFollowingForUsers = createAsyncThunk(
  "follow/checkFollowingForUsers",
  async (creatorIds, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/follow/followers/check`, { creatorIds });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const toggleFollowing = createAsyncThunk(
  "follow/toggleFollowing",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const currentState = getState().follow.following;
      const isFollowing = currentState[userId];

      
      const response = await api.post(`${API_URL}/follow/toggle/${userId}`);
      return { userId, isFollowing: !isFollowing };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState: {
    following: {}, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(checkFollowingForUsers.fulfilled, (state, action) => {
        
        Object.entries(action.payload).forEach(([userId, isFollowing]) => {
          state.following[userId] = isFollowing;
        });
      })
      .addCase(checkFollowingForUsers.rejected, (state, action) => {
        state.error = action.payload;
      })

     
      .addCase(toggleFollowing.fulfilled, (state, action) => {
        const { userId, isFollowing } = action.payload;
        state.following[userId] = isFollowing; 
      })
      .addCase(toggleFollowing.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default followSlice.reducer;