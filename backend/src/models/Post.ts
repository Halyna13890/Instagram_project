import mongoose, {Schema, Document, Types} from "mongoose";

interface IPost extends Document{
    image: string,
    text: string,
    user: Types.ObjectId
    createAt: Date
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
    createAt:{
        type: Date,
        default: Date.now
    }
})


const Post = mongoose.model<IPost>('Post', postSchema)

export default Post