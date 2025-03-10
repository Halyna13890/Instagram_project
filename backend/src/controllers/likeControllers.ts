import {Response} from "express"
import { AuthRequest } from "../middleware/authMidlleware";
import mongoose from "mongoose";
import Like from "../models/Like";
import Post from "../models/Post";



export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { post } = req.body;
        const userId = req.userId;

        const postId = new mongoose.Types.ObjectId(post);

        if (!postId) {
            res.status(400).json({ message: "postId is required" });
            return;
        }

        
        const existingLike = await Like.findOne({ user: userId, post: postId });

        if (!existingLike) {
            
            const newLike = new Like({ user: userId, post: postId });
            await newLike.save();

           
            const updatedPost = await Post.findById(postId);
            if (updatedPost) {
                updatedPost.likesCount += 1;
                await updatedPost.save(); 
            }

            res.status(201).json({ message: "Like added", post: updatedPost });

        } else {
           
            await Like.deleteOne({ _id: existingLike._id });

            
            const updatedPost = await Post.findById(postId);
            if (updatedPost) {
                updatedPost.likesCount -= 1;
                await updatedPost.save();  
            }

            res.status(200).json({ message: "Like removed", post: updatedPost });
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
