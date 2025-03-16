import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL); // Лог для проверки API_URL

const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            console.log("Sending userData:", userData); // Лог для проверки данных перед отправкой
            const response = await axios.post(`${API_URL}/user/register`, userData);
            console.log("Server response:", response.data); // Лог для проверки ответа сервера
            return response.data;
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message); // Лог ошибки
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {}, // Исправлено с redusers на reducers
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                console.log("Registration request started"); // Лог для отладки статуса
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log("Registration successful:", action.payload); // Лог успешной регистрации
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                console.error("Registration failed:", action.payload); // Лог ошибки регистрации
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default registerSlice.reducer;
