import mongoose, {Schema, Document, Types} from "mongoose";

interface ILike extends Document {
    post: Types.ObjectId,
    user: Types.ObjectId,
    createdAt: Date
}

const likeShema = new mongoose.Schema<ILike>({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
}, { timestamps: true })


const Like = mongoose.model<ILike>('Like', likeShema)


export default Like