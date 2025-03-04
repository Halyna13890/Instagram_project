import { Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/authMidlleware";


export const getPosts = async (req: AuthRequest, res: Response) => {
    try {
        const posts = await Post.find({ user: req.userId });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "Posts not found" });
        }

        res.status(200).json({ posts });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { image, text } = req.body;

        if (!req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const newPost = new Post({ image, text, user: req.userId });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        await post.deleteOne();
        res.status(200).json({ message: `Post with id: ${id} was deleted` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({ message: `Post with id: ${id} was successfully updated`, updatedPost });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
