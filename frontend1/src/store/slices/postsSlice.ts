import { createSlice, createAsyncThunk, asyncThunkCreator } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/api/interceptor";
import { getErrorMessage } from "@/utils";
import type { ApiMessageResponse } from "@/types/apiRequestsType";
import type { Post, PostPayload, PostsState, UpdateUserArg } from "@/types/postsType";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Post[]>(`${API_URL}/`);

      const posts = response.data;

      if (!posts) {
        throw new Error("Posts missing in response");
      }

      return posts;

    } catch (error) {
      const errorMessage = getErrorMessage(error, "Fehler beim Laden der Beiträge",);

      return rejectWithValue(errorMessage);
    }
  },
);

export const getOnePost = createAsyncThunk(
  "posts/getOnePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Post>(`${API_URL}/onepost/${postId}`);
      const post = response.data;

      if (!post) {
        throw new Error("Post missing in response");
      }

      return post;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Post loading error");
      return rejectWithValue(errorMessage);
    }
  },
);


export const getUserPosts = createAsyncThunk(
    'posts/getUserPosts',

    async (userId: string, {rejectWithValue}) => {
        try{
            const response = await api.get<Post[]>(`${API_URL}/oneuser/${userId}`);

            const userPosts = response.data

            if(!userPosts){
                throw new Error("Post loading error")
            }

            return userPosts
        } catch(error){
            const errorMessage = getErrorMessage(error, "Post loading error");
            return rejectWithValue(errorMessage);
        }
    }

)


export const createPost = createAsyncThunk(
 'posts/createPost',
  async({postId, postData}: UpdateUserArg, {rejectWithValue}) => {

     try{
       const response = await api.post<Post>(`${API_URL}/${postId}`, postData)
       
       return response.data

    } catch(error){

      const errorMessage = getErrorMessage(error, "Post not save")
      return rejectWithValue(errorMessage)
    }
  }
   
)


export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async(postData: PostPayload, {rejectWithValue}) => {
      try{
        const response = await api.put<Post>(`${API_URL}/${postId}`, postData)

        return response.data
      } catch(error){
         const errorMessage = getErrorMessage(error, "Post loading error");
        return rejectWithValue(errorMessage);
      }
  }
)


export const deletePost = createAsyncThunk(
 'posts/deletePost',
  async(postId: string, {rejectWithValue}) => {

     try{
       const response = await api.post<Post>(`${API_URL}/${postId}`)
       
       return response.data

    } catch(error){

      const errorMessage = getErrorMessage(error, "Post was not deleted")
      return rejectWithValue(errorMessage)
    }
  }
   
)

const initialState: PostsState = {
    posts: [],
    loading: false,
    errors:{
        fetchAllPostsError:  null,
        createPostError:   null,
        deletePostError:  null,
        fetchOnePostError: null,
    }

}


const postsSlise = createSlice({

  name: "posts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

    .addCase(getAllPosts.pending, (state) =>{
      state.loading = true
      state.errors.fetchAllPostsError =null
    })

    .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
        state.errors.fetchAllPostsError = null
          })
  
    .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false
        state.errors.fetchAllPostsError = action.payload
 
          })

    .addCase(getOnePost.pending, (state) =>{
      state.loading = true
      state.errors.fetchOnePostError =null
    })

    .addCase(getOnePost.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload
        state.errors.fetchOnePostError = null
          })
  
    .addCase(getOnePost.rejected, (state, action) => {
        state.loading = false
        state.errors.fetchOnePostError = action.payload
 
          })


     .addCase(getUserPosts.pending, (state) => {
        state.loading = true
        state.errors.fetchAllPostsError = false 
           } )
           
    .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
        state.errors.fetchAllPostsError = null
           } )
    
    .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false
        state.errors.fetchAllPostsError = action.payload
                   
           } )


    .addCase(createPost.pending, (state) => {
        state.loading = true
        state.errors.fetchOnePostError = false 
           } )
           
    .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload
        state.errors.fetchOnePostError = null
           } )
    
    .addCase(createPost.rejected, (state, action) => {
        state.loading = false
        state.errors.fetchOnePostError = action.payload
                   
           } )

    .addCase(deletePost.pending, (state) => {
        state.loading = true
        state.errors.fetchOnePostError = false 
           } )
           
    .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload
        state.errors.fetchOnePostError = null
           } )
    
    .addCase(deletePost.rejected, (state, action) => {
        state.loading = false
        state.errors.fetchOnePostError = action.payload
                   
           } )

  }
  
})
    