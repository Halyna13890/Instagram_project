import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/api/interceptor";
import Cookies from "js-cookie";
import { ApiError } from "@/types/apiErrorType";
import { User, LoginCredentials, RegisterCredentials } from "@/types/userType";

const API_URL = import.meta.env.VITE_API_URL;

export interface AuthState {
    token: string | null,
    user: User | null,
    loading: boolean,
    error: string | null | ApiError

}


export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
        try {
            const response = await axios.post<>(`${API_URL}/api/register`, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await axios.post<>(`${API_URL}/api/login`, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as ApiError);
        }
    }
);
