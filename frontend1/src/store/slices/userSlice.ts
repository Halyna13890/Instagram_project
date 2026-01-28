import { createSlice,  createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/api/interceptor";
import Cookies from "js-cookie";
import {getErrorMessage} from "@/utils"
import type { ApiMessageResponse } from "@/types/apiRequestsType";
import type { ApiUser, LoginCredentials, RegisterCredentials, AuthResponse, 
            AuthState, UpdateUserArg, resetPasswordArg, searchUsersResponse} from "@/types/userType";

const API_URL = import.meta.env.VITE_API_URL;



export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(`${API_URL}/api/register`, credentials);
            return response.data;
        } catch (error) {
           const errorMessage = getErrorMessage(error, "Registrierungsfehler")
           return rejectWithValue(errorMessage)
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
            const errorMessage = getErrorMessage(error, "Loginfehler")
           return rejectWithValue(errorMessage)
        }
    }
);



export const fetchUserProfile = createAsyncThunk(
        'user/fetchUserProfile',
            async (userId: string, {rejectWithValue} ) => {
            try {
            const response = await api.get<ApiUser>(`${API_URL}/api/profile/${userId}`);
            
           

            return response.data
            
                } catch (error) {
                  const errorMessage = getErrorMessage(error, "Fehler beim Laden der Benutzerdaten")
                return rejectWithValue(errorMessage)
                }
            }
)

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
   async ({userId, userData}: UpdateUserArg, {rejectWithValue}) => {
        try{
            const response = await api.put<ApiUser>(`${API_URL}/profile/${userId}`, userData)
           
            return response.data
    }catch (error) {
                const errorMessage = getErrorMessage(error, "Benutzerprofil nicht aktualisiert")
                return rejectWithValue(errorMessage)
                }
   }
    
)

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (_ , {rejectWithValue}) => {
        try{
            const response = await api.post<ApiMessageResponse>( `${API_URL}/forgot-password`)
            
            return response.data
        } catch (error) {
                 const errorMessage = getErrorMessage(error, "Passwort-Änderungsanfrage nicht gesendett")
                return rejectWithValue(errorMessage)
                }
    }
)

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async({token, newPassword}: resetPasswordArg, {rejectWithValue}) => {
       try{
          const response = await api.post<ApiMessageResponse>(`${API_URL}/reset-password/${token}`, newPassword)
          return response.data.message
         
       } catch (error) {
                  const errorMessage = getErrorMessage(error, "Passwort nicht geändert")
                return rejectWithValue(errorMessage)
                }
    }
)


export const searchUsers = createAsyncThunk(
    'user/searchUsers',
    async (searchTerm: string, {rejectWithValue}) => {
        try{
            const response = await api.get<searchUsersResponse[]>(`${API_URL}/search`, {params: {search: searchTerm}})

            return response.data

        }  catch (error) {
                 const errorMessage = getErrorMessage(error, "Fehler bei der Benutzersuche")
                    return rejectWithValue(errorMessage)
                }
    } 
    
)

const initialState: AuthState = {
        token: Cookies.get("auth_token") || null,
        user: null,
        loading: false,
        errors: {
        authError: null,
        profileError: null,
        forgotPassError: null,
        resetPassError: null,
        },
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
            state.errors.authError = null
        })

        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload.token
            state.user = action.payload.user
            state.errors.authError = null
        })

        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false
            state.errors.authError = action.payload
            
            
        })

        .addCase(loginUser.pending, (state) => {
            state.loading = true
            state.errors.authError = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload.token
            state.user = action.payload.user
            state.errors.authError = null
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false
            state.errors.authError = action.payload
        })

       .addCase(fetchUserProfile.pending, (state) => {
            state.loading = true
            state.errors.profileError = false 
       } )
       
       .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.errors.profileError = null
       } )

        .addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false
            state.errors.profileError = action.payload
               
       } )

       .addCase(updateUserProfile.pending, (state) => {
            state.loading = true
            state.errors.profileError = false
       })
       
       .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.errors.profileError = null
       } )
       
       .addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false
            state.errors.profileError = action.payload
               
       } )

       .addCase(forgotPassword.pending, (state) => {
            state.loading = true
            state.errors.profileError = false
       })
       
       .addCase(forgotPassword.fulfilled, (state) => {
            state.loading = false
       } )
       
       .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false
            state.errors.forgotPassError = action.payload
               
       } )


        .addCase(resetPassword.pending, (state) => {
            state.loading = true
            state.errors.resetPassError = false
       })
       
       .addCase(resetPassword.fulfilled, (state) => {
            state.loading = false
       } )
       
       .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false
            state.errors.resetPassError = action.payload
               
       } )




    }
})