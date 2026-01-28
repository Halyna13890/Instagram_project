import { createSlice,  createAsyncThunk, rejectWithValue } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import axios from "axios";
import api from "@/api/interceptor";
import Cookies from "js-cookie";
import type { ApiError, ApiMessageResponse } from "@/types/apiRequestsType";



