import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("No token found");
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        console.log("Decoded userId: ", decoded.userId);
        req.userId = decoded.userId; 
        next(); 
    } catch (error) {
        console.log("Invalid token", error);
        res.status(401).json({ message: "Invalid token" });
        return; 
    }
}
