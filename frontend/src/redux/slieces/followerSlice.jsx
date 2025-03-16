import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const checkFollowingForUsers = createAsyncThunk(
  'follow/checkFollowingForUsers',
  async (userIds, { rejectWithValue }) => {
    try {
     
      const response = await api.post(`${API_URL}/follow/followers/check`, { creatorIds: userIds });

      console.log("Ответ от сервера по проверке подписок:", response.data);
      return response.data; 
    } catch (error) {
   
      console.error("Ошибка при проверке подписок:", error.message);
      return rejectWithValue(error.message);
    }
  }
);


export const toggleFollowing = createAsyncThunk(
  'follow/toggleFollowing',
  async (userId, { getState, rejectWithValue }) => {
    try {
      console.log(`Запрос на изменение подписки для пользователя ${userId}`); 

      const currentState = getState().follow.following;
      const isFollowing = currentState[userId];
      console.log(`Текущий статус подписки для пользователя ${userId}:`, isFollowing); 

      const response = await api.post(`${API_URL}/follow/toggle/${userId}`);
      console.log(`Ответ от сервера для изменения подписки пользователя ${userId}:`, response.data); 


      return { userId, isFollowing: !isFollowing, userData: response.data.user };
    } catch (error) {
      console.error(`Ошибка при изменении подписки для пользователя ${userId}:`, error.message); 
      return rejectWithValue(error.message);
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    following: {}, 
    users: {}, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkFollowingForUsers.fulfilled, (state, action) => {
        console.log("Fetched following data:", action.payload);
        state.following = action.payload; 
      })
      .addCase(checkFollowingForUsers.rejected, (state, action) => {
        console.error("Ошибка при получении данных о подписках:", action.payload); 
        state.error = action.payload;
      })
      .addCase(toggleFollowing.fulfilled, (state, action) => {
        const { userId, isFollowing, userData } = action.payload;

        console.log(`Изменение подписки для пользователя ${userId}:`, isFollowing); 

       
        state.following[userId] = isFollowing;

       
        if (userData) {
          state.users[userId] = {
            ...state.users[userId], 
            followers: userData.followers, 
            following: userData.following, 
            isFollowing: isFollowing, 
          };
          console.log(`Обновлены данные пользователя ${userId}:`, state.users[userId]); 
        }
      })
      .addCase(toggleFollowing.rejected, (state, action) => {
        console.error("Ошибка при изменении подписки:", action.payload); 
        state.error = action.payload;
      });
  },
});

export default followSlice.reducer;
