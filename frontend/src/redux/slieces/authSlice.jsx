import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import api from "../../api/interceptor"

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

export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (userId, { rejectWithValue }) => {
        try {
            console.log("Fetching profile for userId:", userId);
            const response = await api.get(`${API_URL}/user/profile/${userId}`);
            console.log("Profile response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/user/profile/${userId}`, userData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.updatedProfile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: Cookies.get("auth_token") || null,
        user: null,
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
                state.user = null;
                state.loading = false;
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
