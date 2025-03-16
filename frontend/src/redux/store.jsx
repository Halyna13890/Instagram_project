import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./slieces/registerSlice";
import authReduсer from "./slieces/authSlice"
import followReduсer from "./slieces/followerSlice"
import likesReduсer from "./slieces/likeSlise"
import allPostsReduсer from "./slieces/postSlice"
import commentReduser from "./slieces/commentSlice"

 export const store = configureStore({
    reducer: {
        register: registerReducer,
        auth: authReduсer,
        follow: followReduсer,
        allPosts: allPostsReduсer,
        likes: likesReduсer,
        comments: commentReduser,

    },
})

export default store;