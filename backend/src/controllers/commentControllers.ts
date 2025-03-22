import {Response} from "express"
import { AuthRequest } from "../middleware/authMidlleware";
import mongoose from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { IntUser } from "../models/User";
import {commentFormatTimeDifference}  from "../utils/commentTimeFormat"


export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message } = req.body;  
        const { postId } = req.params;  
        const user = req.userId;  

        if (!postId || !message || !user) {
            res.status(400).json({ message: "Post ID, message, and user ID are required" });
            return;
        }

        const postDocument = await Post.findById(postId);
        if (!postDocument) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const newComment = new Comment({
            user: user,
            post: postId,
            message,
            postUser: postDocument.user
        });

        await newComment.save();

        postDocument.commentCount += 1;
        await postDocument.save();

        res.status(201).json({ message: "Comment added", comment: newComment });

    } catch (error: any) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: error.message });
    }
};




export const getPostsComments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params; 


        if (!id) {
           res.status(403).json({ message: "Post ID is required in URL" });
           return 
        }

        const postComments = await Comment.find({ post: id })
        .populate("user", "image username")
        

        if (!postComments || postComments.length === 0) {
             res.status(404).json({ message: "Comment not found" });
             return
        }

        res.status(200).json(postComments);
        return 

    } catch (error: any) {
       
       res.status(500).json({ error: error.message });
       return 
    }
};



export const getCommentNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const CommentUsers = await Comment.find({ postUser: userId })
            .populate<{ user: IntUser }>("user", "username image")
            .lean();

        const formattedLikes = CommentUsers.map(comment => ({
            id: comment._id,
            username: comment.user.username, 
            image: comment.user.image,
            timeMessage: commentFormatTimeDifference(comment.createdAt)
        }));

        res.json(formattedLikes);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}