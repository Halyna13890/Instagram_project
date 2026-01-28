import type { deletePost } from "@/store/slices/postsSlice";
import { createActionCreatorInvariantMiddleware } from "@reduxjs/toolkit";


export interface UserDisplayData{
    userId: string;
    avatar: string;
    userName: string
}
//pereimenovat na becke u Usera image- createActionCreatorInvariantMiddleware, i 
//u Post image - postImage

export interface Post {
    postId: string;
    postImage: string;
    text: string;
    user: UserDisplayData;
    createAt: Date;
    likesCount: number;
    commentCount: number;
}


export interface PostPayload{
    userId: string;
    postImage?: string;
    text?: string;
}


export interface UpdateUserArg{
    postId: string,
    postData: PostPayload
}



export interface PostsState {
    posts: Post[],
    currentPost?: Post,
    loading: boolean,
    errors:{
        fetchAllPostsError:  unknown | null,
        createPostError:  unknown | null,
        deletePostError:  unknown | null,
        fetchOnePostError:  unknown | null,
    }
}

