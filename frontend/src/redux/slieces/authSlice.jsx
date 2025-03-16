import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {

            const response = await axios.post(`${API_URL}/user/login`, userData);
            
            const { token } = response.data;
            if (!token) {
                throw new Error("Token is missing in response");
            }

            Cookies.set("auth_token", token, { expires: 1 / 3 });
          
            return token;
        } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    Cookies.remove("auth_token");
   
    return null;
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: Cookies.get("auth_token") || null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
               
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {

                state.loading = false;
                state.token = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {

                state.token = null;
                state.loading = false;
            });
    },
});

export default authSlice.reducer;