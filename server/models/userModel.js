import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min:3,
        maxi:20,
        unique:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    isAvatarImgSet: {
        type: Boolean,
        default: false,
    },
    avatarImg: {
        type: String,
        default: "",
    },
});

const User = mongoose.model("Users", userSchema);
export default User;

