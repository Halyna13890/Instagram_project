import { createSlice,  createAsyncThunk, rejectWithValue } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import axios from "axios";
import api from "@/api/interceptor";
import Cookies from "js-cookie";
import type { ApiError, ApiMessageResponse } from "@/types/apiRequestsType";
import type { ApiUser, LoginCredentials, RegisterCredentials, AuthResponse, 
            AuthState, UpdateUserArg, resetPasswordArg} from "@/types/userType";

const API_URL = import.meta.env.VITE_API_URL;



export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(`${API_URL}/api/register`, credentials);
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
            const response = await api.post<AuthResponse>(`${API_URL}/api/login`, credentials);

            const {token, user} = response.data

            if(!token){
                throw new Error("Token missing in ressponse")
            }

            if(!user){
                throw new Error("User missing in response")
            }

            Cookies.set("auth_token", token, {expires: 1/3})



            return {token, user};
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);



export const fetchUserProfile = createAsyncThunk(
        'user/fetchUserProfile',
            async (userId: string, {rejectWithValue} ) => {
            try {
            const response = await api.get<ApiUser>(`${API_URL}/api/profile/${userId}`);
            const user = response.data

            if(!user){
            throw new Error("User missing in response")
            }

            return user
            
                } catch (error) {
                 return rejectWithValue(error.response?.data?.message);
                }
            }
)

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
   async ({userId, userData}: UpdateUserArg, {rejectWithValue}) => {
        try{
            const response = await api.put<ApiUser>(`${API_URL}/profile/${userId}`, userData)
            const user = response.data
            if(!user){
            throw new Error("User missing in response")
            }
            return user
    }catch (error) {
                 return rejectWithValue(error.response?.data?.message);
                }
   }
    
)

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (_ , {rejectWithValue}) => {
        try{
            const response = await api.post<ApiMessageResponse>( `${API_URL}/forgot-password`)
            const message = response.data.message
             if(message){
            throw new Error("Message missing in response")
            }
            return message
        } catch (error) {
                 return rejectWithValue(error.response?.data?.message);
                }
    }
)

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async({token, PassData}: resetPasswordArg, {rejectWithValue}) => {
       try{
          const response = await api.post<ApiMessageResponse>(`${API_URL}/reset-password/${token}`, PassData)
          const message = response.data.message

          if(!message){
            throw new Error("Message missing in response")
          }
       } catch (error) {
                 return rejectWithValue(error.response?.data?.message);
                }
    }
)


const initialState: AuthState = {
        token: Cookies.get("auth_token") || null,
        user: null,
        loading: false,
        authError: null,
        profileError: null,
        success: false,
    }

const authSlise = createSlice({

    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.loading = false;
            Cookies.remove("auth_token")
        }
    },
    extraReducers: (builder) => {
        builder

         .addCase(registerUser.pending, (state) => {
            state.loading = true
            state.authError = null
        })

        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload.token
            state.user = action.payload.user
            state.authError = null
        })

        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false
            state.authError = action.payload
             state.authError = action.payload as string
            
        })

        .addCase(loginUser.pending, (state) => {
            state.loading = true
            state.authError = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload.token
            state.user = action.payload.user
            state.authError = null
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false
            state.authError = action.payload as string
        })

       .addCase(fetchUserProfile.pending, (state) => {
            state.loading = true
            state.profileError = false 
       } )
       
       .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.profileError = null
       } )

        .addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false
            state.profileError = action.payload as string
            
           
       } )

       
       

    }
})