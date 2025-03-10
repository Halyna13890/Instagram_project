import mongoose, { Schema, Document, Types } from "mongoose";

interface IComment extends Document {
    post: Types.ObjectId;
    user: Types.ObjectId;
    message: string;
    createdAt: Date;
}


const commentSchema = new mongoose.Schema<IComment>({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", 
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
}, { timestamps: true });


const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
