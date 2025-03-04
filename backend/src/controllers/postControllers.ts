import { Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/authMidlleware";


export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({});

        if (!posts || posts.length === 0) {
            res.status(404).json({ message: "Posts not found" });
            return;
        }

        res.status(200).json({ posts });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { image, text } = req.body;
        const newPost = new Post({ image, text, user: req.userId });

        await newPost.save();

        res.status(201).json(newPost);
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
        const post = await Post.findById(id);

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.user.toString() !== req.userId) {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPost) {
            res.status(500).json({ message: "Failed to update post" });
            return;
        }

        res.status(200).json({ message: `Post with id: ${id} was successfully updated`, updatedPost });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

