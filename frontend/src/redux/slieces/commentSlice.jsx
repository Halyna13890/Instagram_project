import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (postId, { rejectWithValue }) => {
      try {
        console.log("Запрос комментариев для postId:", postId);
        const response = await api.get(`${API_URL}/comment/all/${postId}`);
  
        console.log("Ответ от сервера:", response.data); 
  
        if (response.data.error) {
          console.error("Ошибка в ответе сервера:", response.data.error);
          return rejectWithValue(response.data.error);
        }
  
        return response.data; 
      } catch (error) {
        console.error("Ошибка при запросе комментариев:", error.message);
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
  reducers: {}, 
  extraReducers: (builder) => {
  builder
    .addCase(fetchComments.pending, (state) => {
      console.log("Запрос комментариев начат");
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchComments.fulfilled, (state, action) => {
        console.log("Запрос комментариев успешно завершен", action.payload);
        state.comments = action.payload; 
        state.loading = false;
      })
    .addCase(fetchComments.rejected, (state, action) => {
      console.error("Запрос комментариев завершен с ошибкой", action.payload);
      state.error = action.payload || action.error.message;
      state.loading = false;
    });
},
});

export default commentSlice.reducer;