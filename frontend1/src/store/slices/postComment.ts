import { createSlice, createAsyncThunk, asyncThunkCreator } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/api/interceptor";
import { getErrorMessage } from "@/utils";
import type { ApiMessageResponse } from "@/types/apiRequestsType";
import type { Post, CreatePost } from "@/types/commentType";




