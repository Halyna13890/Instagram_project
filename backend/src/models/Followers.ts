import mongoose, { Schema, Document, Types } from "mongoose";
import { IntUser } from "./User";


interface FollowerEntry {
    follower_id: Types.ObjectId;
    createdAt: Date;
}


interface PopulatedFollowerEntry {
    follower_id: IntUser;
    createdAt: Date;
}

export interface IFollower extends Document {
    user: Types.ObjectId;
    followers: FollowerEntry[];
}


export interface PopulatedFollower extends Document {
    user: Types.ObjectId;
    followers: PopulatedFollowerEntry[];
}

const followerSchema = new mongoose.Schema<IFollower>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    followers: [{
        follower_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Follower = mongoose.model<IFollower>('Follower', followerSchema);

export default Follower;