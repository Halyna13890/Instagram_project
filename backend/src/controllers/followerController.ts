import { Response } from "express";
import { AuthRequest } from "../middleware/authMidlleware";
import mongoose from "mongoose";
import { IntUser } from "../models/User"
import User from "../models/User"
import Follower, { PopulatedFollower } from "../models/Followers";

export const getAllFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        
       
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid userId" });
            return;
        }

        const followerData = await Follower.findOne({ user: new mongoose.Types.ObjectId(userId) })
            .populate("followers.follower_id", "username image") as unknown as PopulatedFollower | null;

      
        if (!followerData) {
            res.status(404).json({ message: "User has no followers" });
            return;
        }

        const existsFollowers = followerData.followers.map(f => ({
            id: f.follower_id._id,
            username: f.follower_id.username,
            image: f.follower_id.image,
        }));

        res.json(existsFollowers);
    } catch (error: any) {
        
        res.status(500).json({ error: error.message });
    }
};

export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        
        const followingData = await Follower.find({ "followers.follower_id": userId })
        .populate("user", "username image") as unknown as Array<PopulatedFollower & { user: IntUser }>;
        
        if (!followingData || followingData.length === 0) {
            res.status(404).json({ message: "User is not following anyone" });
            return;
        }
        
        
        const following = followingData.map(record => ({
            id: record.user._id,
            username: record.user.username,
            image: record.user.image,
        }));
        
        res.json(following);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const toggleFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log("Received request to toggle following");

        const { follovingUser } = req.params;
        const userId = req.userId;

        console.log("Extracted userId from token:", userId);
        console.log("Extracted follovingUser from params:", follovingUser);

        if (!userId) {
            console.error("userId is missing");
            res.status(400).json({ message: "userId is required" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(follovingUser)) {
            console.error("Invalid follovingUserId:", follovingUser);
            res.status(400).json({ message: "Invalid follovingUserId" });
            return;
        }

        const follovingUserId = new mongoose.Types.ObjectId(follovingUser);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);

       

        const existingFollowingUser = await Follower.findOne({ user: follovingUserId });
        console.log("Existing Following User:", existingFollowingUser);

        if (!existingFollowingUser) {
            console.log("No existing following record found. Creating new...");

            const NewFollower = new Follower({
                user: follovingUserId,
                followers: [{
                    follower_id: userIdObjectId,
                    dateAt: Date.now()
                }]
            });
            await NewFollower.save();

           

            const updatedFollowerUser = await User.findById(follovingUserId);
            if (updatedFollowerUser) {
                updatedFollowerUser.followers += 1;
                await updatedFollowerUser.save();
               
            }

            const updatedFollowingUser = await User.findById(userIdObjectId);
            if (updatedFollowingUser) {
                updatedFollowingUser.following += 1;
                await updatedFollowingUser.save();
                
            }

            res.status(201).json({ message: "Followed successfully" });
        } else {
           
            const isAlreadyFollowing = existingFollowingUser.followers.some(f => f.follower_id.toString() === userId);
            console.log("Is already following:", isAlreadyFollowing);

            if (!isAlreadyFollowing) {
                console.log("User is not yet following. Adding to list...");

                existingFollowingUser.followers.push({ follower_id: userIdObjectId, createdAt: new Date() });
                await existingFollowingUser.save();

                console.log("User successfully followed");

                const updatedFollowerUser = await User.findById(follovingUserId);
                if (updatedFollowerUser) {
                    updatedFollowerUser.followers += 1;
                    await updatedFollowerUser.save();
                    console.log("Updated followers count for", follovingUserId);
                }

                const updatedFollowingUser = await User.findById(userIdObjectId);
                if (updatedFollowingUser) {
                    updatedFollowingUser.following += 1;
                    await updatedFollowingUser.save();
                    console.log("Updated following count for", userIdObjectId);
                }

                res.status(201).json({ message: "Followed successfully" });

            } else {
               
                existingFollowingUser.followers = existingFollowingUser.followers.filter(f => f.follower_id.toString() !== userId);
                
                if (existingFollowingUser.followers.length === 0) {
                    console.log("No followers left. Deleting document...");
                    await Follower.findByIdAndDelete(existingFollowingUser._id);

                    
                } else {
                   
                    await existingFollowingUser.save();
                }

                const updatedFollowerUser = await User.findById(follovingUserId);
                if (updatedFollowerUser) {
                    updatedFollowerUser.followers -= 1;
                    await updatedFollowerUser.save();
                   
                }

                const updatedFollowingUser = await User.findById(userIdObjectId);
                if (updatedFollowingUser) {
                    updatedFollowingUser.following -= 1;
                    await updatedFollowingUser.save();
                   
                }

                res.status(200).json({ message: "Unfollowed successfully" });
            }
        }
    } catch (error: any) {
        
        res.status(500).json({ error: error.message });
    }
};
