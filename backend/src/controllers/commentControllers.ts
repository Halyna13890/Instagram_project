import {Response} from "express"
import { AuthRequest } from "../middleware/authMidlleware";
import mongoose from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";


export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { post, message } = req.body;
        const user = req.userId; 

        

       
        if (!post || !message || !user) {
            res.status(400).json({ message: "Post, message, and userId are required" });
            return;
        }

        const postId = new mongoose.Types.ObjectId(post); 
       
        console.log("Converted postId:", postId);

        
        if (!postId) {
            console.log("Invalid postId");
            res.status(400).json({ message: "Invalid postId" });
            return;
        }

        
        const newComment = new Comment({ user: user, post: postId, message });

       
        await newComment.save();

        

        
        const updatedPost = await Post.findById(postId);
        if (updatedPost) {
            updatedPost.commentCount += 1;
            await updatedPost.save();

           
        }

        
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
             res.status(404).json({ message: "User posts not found" });
             return
        }

        res.status(200).json(postComments);
        return 

    } catch (error: any) {
       
       res.status(500).json({ error: error.message });
       return 
    }
};