import { Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/authMidlleware";
import mongoose from "mongoose";


export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({})     
        .populate("user", "avatar username")
        
  

        if (!posts || posts.length === 0) {
            res.status(404).json({ message: "Posts not found" });
            return;
        }

        res.status(200).json({ posts });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getOnePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
         
        const { id } = req.params; 
        
        if (!id) {
            res.status(400).json({ message: "Post ID is required" });
            return;
        }
        
        const post = await Post.findById(id)
            .populate("user", "avatar username");

       
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json({ post });
    } catch (error: any) {
       
        res.status(500).json({ error: error.message });
    }
};


export const getUserPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params; 


        if (!id) {
           res.status(403).json({ message: "User ID is required in URL" });
           return 
        }

        const userPosts = await Post.find({ user: id })
        
        

        if (!userPosts || userPosts.length === 0) {
             res.status(404).json({ message: "User posts not found" });
             return
        }

        res.status(200).json(userPosts);
        return 

    } catch (error: any) {
       
       res.status(500).json({ error: error.message });
       return 
    }
};







export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { text } = req.body;
  
      if (!req.file) {
        res.status(400).json({ message: "Image is required" });
        return;
      }
  
      const imageBuffer = req.file.buffer;
      const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString("base64")}`;
  
      const newPost = new Post({
        text,
        postImage: base64Image,
        user: req.userId,
      });
  
      await newPost.save();
  
      res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
    
    export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }



        if (post.user.toString() !== req.userId) {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        await post.deleteOne();
        res.status(200).json({ message: `Post with id: ${id} was deleted` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};






    export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { text } = req.body;
    
            const post = await Post.findById(id);
            
            if (!post) {
                res.status(404).json({ message: "Post not found" });
                return;
            }

            if (post.user.toString() !== req.userId) {
                res.status(403).json({ message: "Access denied" });
                return;
            }
 
            if (text) {
                post.text = text;
            }
 
            if (req.file) {
                const imageBuffer = req.file.buffer;
                const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString("base64")}`;
                post.postImage = base64Image;
            }
    
            await post.save();
    
            res.status(200).json({ message: "Post updated successfully", post });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };


