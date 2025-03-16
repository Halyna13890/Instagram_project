import {Response} from "express"
import { AuthRequest } from "../middleware/authMidlleware";
import mongoose from "mongoose";
import Like from "../models/Like";
import Post from "../models/Post";
import { likeFormatTimeDifference } from "../utils/likeTimeFormat"
import { IntUser } from "../models/User";


export const checkLikesForPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        let { postIds } = req.body;

        
        if (!Array.isArray(postIds)) {
            postIds = [postIds];
            console.log('postIds is not an array, converted to array:', postIds);
        }

        
        postIds = postIds.filter((id: string) => mongoose.Types.ObjectId.isValid(id));
        

        if (postIds.length === 0) {
            res.status(400).json({ message: "postIds must contain valid post IDs" });
            return;
        }

        
        const existingLikes = await Like.find({
            user: userId,
            post: { $in: postIds },
        });

        
        const result = postIds.reduce((acc: Record<string, boolean>, postId: string) => {
            console.log('Checking like for postId:', postId);
            acc[postId] = existingLikes.some(like => like.post.toString() === postId);
            return acc;
        }, {} as Record<string, boolean>);

        

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: error.message });
    }
};




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

            const postDocument = await Post.findById(postId)

            if(!postDocument){
                res.status(404).json({message: "Post not found"})
                return;
            }
            const PostUser = postDocument.user

            const newLike = new Like({ 
                user: userId, 
                post: postId, 
                postUser: PostUser,
            });
            await newLike.save();

           
            const updatedPost = await Post.findById(postId);
            if (updatedPost) {
                updatedPost.likesCount += 1;
                await updatedPost.save(); 
            }

            res.status(201).json({ message: "Like added", post: updatedPost, isLike: true });

        } else {
           
            await Like.deleteOne({ _id: existingLike._id });

            
            const updatedPost = await Post.findById(postId);
            if (updatedPost) {
                updatedPost.likesCount -= 1;
                await updatedPost.save();  
            }

            res.status(200).json({ message: "Like removed", post: updatedPost, isLike: false });
        }

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};




export const getLikeNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        console.log(`Fetching like notifications for user ID: ${userId}`);


        const likeUsers = await Like.find({ postUser: userId })
            .populate<{ user: IntUser }>("user", "username image")
            .lean();

        console.log(`Found ${likeUsers.length} like notifications`);

        if (likeUsers.length === 0) {
            
            res.json([]);
            return;
        }

        const formattedLikes = likeUsers.map(like => ({
            id: like._id,
            username: like.user.username, 
            image: like.user.image,
            timeMessage: likeFormatTimeDifference(like.createdAt)
        }));
       
        res.json(formattedLikes);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};