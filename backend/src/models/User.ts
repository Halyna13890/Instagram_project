import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IntUser extends Document {
    email: string;
    fullName: string;
    username: string;
    about?: string;
    image?: string;
    website?: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
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
    password: {
        type: String,
        required: true,
    }
});


UserSchema.pre<IntUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IntUser>("User", UserSchema);
export default User;
