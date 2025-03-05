import User, { IntUser } from "../models/User";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMidlleware";

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

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error: any) {
        console.error("Error in registerUser:", error);
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


export const getEditProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profile = await User.findById(req.userId).select("username about photoProfile website")

        if(!profile){
            res.status(404).json({message: "Profile not faund"})
        }

        res.status(200).json(profile)
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }

}


export const updateEditProfile = async (req: AuthRequest, res: Response): Promise<void>  =>{
   try{
    const {username, about, photoProfile, website} = req.body
    const updatedProfile = await User.findByIdAndUpdate(req.userId, 
        {username, about, photoProfile, website},
        { new: true, runValidators: true }
    ).select("-password")
    if(!updatedProfile){
        res.status(404).json({message:"Profile not found"})
        return
    }
    res.status(200).json({message:"Profile was successfully updated", updatedProfile})
    return
   } catch (error: any){ 
        res.status(500).json({error: error.message})
   }
}

