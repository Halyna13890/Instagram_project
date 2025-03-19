import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL


const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/register`, userData);
            return response.data;
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message); 
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {}, 
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {   
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default registerSlice.reducer;
