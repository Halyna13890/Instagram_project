import User, { IntUser } from "../models/User";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

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

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

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
