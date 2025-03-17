import mongoose, {Schema, Document, Types} from "mongoose";
import { IntUser } from "../models/User"

export interface IPost extends Document {
    _id: Types.ObjectId;
    image: string;
    text: string;
    user: IntUser | Types.ObjectId;
    createAt: Date;
    likesCount: number;
    commentCount: number;
}

const postSchema = new mongoose.Schema<IPost>({
    image:{
        type: String,
        required: true,

    },
    text:{
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likesCount:{
        type:Number,
        default: 0
    },
    commentCount:{
        type:Number,
        default: 0
    },
    createAt:{
        type: Date,
        default: Date.now
    }
}, { timestamps: true })


const Post = mongoose.model<IPost>('Post', postSchema)

export default Post