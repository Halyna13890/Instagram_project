import { Response } from "express";
import { AuthRequest } from "../middleware/authMidlleware";
import mongoose from "mongoose";
import { IntUser } from "../models/User"
import User from "../models/User"
import Follower, { PopulatedFollower, PopulatedFollowerEntry} from "../models/Followers";
import {followersFormatTimeDifference} from "../utils/followerTimeFormat"


export const getAllFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        
       
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid userId" });
            return;
        }

        const followerData = await Follower.findOne({ user: userId })
            .populate<{ followers: { follower_id: IntUser }[] }>("followers.follower_id", "username image")
            .lean();

      
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
            .populate<{ user: IntUser }>("user", "username image")
            .lean();
        
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
       

        const { follovingUser } = req.params;
        const userId = req.userId;

        

        if (!userId) {
            console.error("userId is missing");
            res.status(400).json({ message: "userId is required" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(follovingUser)) {
            
            res.status(400).json({ message: "Invalid follovingUserId" });
            return;
        }

        const follovingUserId = new mongoose.Types.ObjectId(follovingUser);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);

       

        const existingFollowingUser = await Follower.findOne({ user: follovingUserId });
        
        if (!existingFollowingUser) {
           

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
               
                existingFollowingUser.followers = existingFollowingUser.followers
                .filter(f => f.follower_id.toString() !== userId);
                
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




export const getFollowersNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        console.log("Received request for followers of user:", userId);

        const myFollowers = await Follower.findOne({ user: userId })
            .populate<{ followers: PopulatedFollowerEntry[] }>("followers.follower_id", "username image")
            .lean();
        
        console.log("Query result from database:", myFollowers);

        if (!myFollowers) {
            console.log("No followers found for user:", userId);
            res.status(404).json({ message: "User has no followers" });
            return;
        }

        console.log("Raw followers array:", myFollowers.followers);

        const formattedFollower = myFollowers.followers.map(follower => {
            console.log("Processing follower:", follower);
            return {
                id: follower.follower_id._id, 
                username: follower.follower_id.username,
                image: follower.follower_id.image,
                timeMessage: followersFormatTimeDifference(follower.createdAt) 
            };
        });

        console.log("Formatted followers data:", formattedFollower);
        res.json(formattedFollower);

    } catch (error: any) {
        console.error("Error fetching followers:", error.message);
        res.status(500).json({ error: error.message });
    }
};
