import { createSlice,  createAsyncThunk, rejectWithValue } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import axios from "axios";
import api from "@/api/interceptor";
import Cookies from "js-cookie";
import type { ApiError, ApiMessageResponse } from "@/types/apiRequestsType";
import type {FollowingForUsersResponse} from "@/types/followersType";


export const checkFollowingForUsers = createAsyncThunk(
    'followers/checkFollowingForUsers',
    async(creatorIds: string[], {rejectWithValue}) => {
        try {
            const {data} = await api.post<FollowingForUsersResponse>(`${API_URL}/followers/check`, {creatorIds});
            return data
        } catch(error) {
            return rejectWithValue(error as ApiError);
        }
    
    }

)
