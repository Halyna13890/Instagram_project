import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor"



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";




export const checkLikesForPosts = createAsyncThunk(
  'likes/checkLikesForPosts',
  async (postIds, { rejectWithValue }) => {
    try {
      const response = await api.post(`http://localhost:5000/like/check`, { postIds });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const toggleLike = createAsyncThunk(
  'likes/toggleLike',
  async (postId, { getState, rejectWithValue }) => {
    try {
      console.log("Отправка запроса на:", `${API_URL}/like/toggle`);

      const response = await api.post(`http://localhost:5000/like/toggle`, { postId });

      console.log("Ответ от сервера:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при лайке:", error);
      return rejectWithValue(error.message);
    }
  }
);





const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    likes: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkLikesForPosts.fulfilled, (state, action) => {
        console.log("Fetched likes data:", action.payload);
        state.likes = action.payload;
      })
      .addCase(checkLikesForPosts.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, isLike, likesCount } = action.payload;
        console.log("Updated like state:", postId, isLike, likesCount);
        state.likes[postId] = { isLike, likesCount };
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
