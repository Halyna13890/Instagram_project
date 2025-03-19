import User, { IntUser } from "../models/User";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMidlleware";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../services/mailService";

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, fullName, username, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = new User({ email, fullName, username, password });
        await newUser.save();

        const userResponse = {
            email: newUser.email,
            fullName: newUser.fullName,
            username: newUser.username,
            about: newUser.about, 
            image: newUser.image, 
            website: newUser.website,

        }

        return res.status(201).json({ message: "User registered successfully", 
            user: userResponse
        });

    } catch (error: any) {
        
        return res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        
        const existingUser = await User.findOne({ email }) as IntUser;
        if (!existingUser) {
            return res.status(400).json({ message: "Login or password is incorrect" });
        }

        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Login or password is incorrect" });
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET as string, { expiresIn: "8h" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {  
        const {id} = req.params
        const profile = await User.findById(id).select("username about image website followers following")

        if(!profile){
            res.status(404).json({message: "Profile not faund"})
            return
        }

        res.status(200).json(profile)
        return
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }

}


export const updateEditProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const { username, about, website } = req.body

        if (req.userId !== id) {
            res.status(403).json({ message: "Access denied" })
            return;
        }

        let base64Image = ''
        if (req.file) {
            const imageBuffer = req.file.buffer;
            base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`
        }

        const updatedProfile = await User.findByIdAndUpdate(
            req.userId,
            { username, about, image: base64Image, website },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedProfile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }

        res.status(200).json({
            message: "Profile was successfully updated",updatedProfile });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};






export const requestPasswordReset = async (req: AuthRequest, res: Response): Promise<void>  => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized request" });
            return 
        }

       
        const user = await User.findById(userId) as IntUser;
        if (!user) {
             res.status(404).json({ message: "User not found" });
             return
        }

       
        const token = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 

        await user.save();

    
        await sendResetPasswordEmail(user.email, token);

        res.json({ message: "Password reset link has been sent to your email" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error" });
    }
};


export const resetPassword = async (req: Request, res: Response): Promise<void>=> {
    try {
        const { token } = req.params; 
        const { newPassword } = req.body;

     
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
             res.status(400).json({ message: "Invalid or expired token" });
             return
        }


        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password successfully changed" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};






export const searchUser = async (req:AuthRequest, res: Response): Promise <void> => {
    try {
        const { search } = req.query; 

        let filter = {};

        if (search) {
            filter = {
                $or: [
                    { username: { $regex: search, $options: "i" } }, 
                    { fullName: { $regex: search, $options: "i" } }  
                ]
            };
        }

        const users = await User.find(filter).select("username fullName image");

        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


