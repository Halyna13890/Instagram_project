import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IntUser extends Document {
    email: string;
    fullName: string;
    userName: string;
    about?: string;
    image?: string;
    website?: string; 
    followers: number;
    following: number;
}


export interface IntAuth extends Document {
    userId: Types.ObjectId
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    resetPasswordToken?: string;
    resetPasswordExpires?: number;
}

const UserSchema: Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    about:{
        type:String,
        required: false,
        default: ""
    },
    image:{
        type: String,
        required: false,
        default: ""
    },
    website:{
        type: String,
        required: false,
        default: ""
    },
    followers:{
        type:Number,
        default: 0
    }, 
    following: {
        type:Number,
        default: 0
    }
});


const AuthSchema: Schema = new mongoose.Schema({
    userId: {
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Number,
        required: false,
    },
});




AuthSchema.pre<IntAuth>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


AuthSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};


export const User = mongoose.model<IntUser>("User", UserSchema)
export const Auth = mongoose.model<IntAuth>("Auth", AuthSchema)