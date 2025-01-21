import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email format"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: [3, "Username must be at least 3 characters long"],
        maxLength: [20, "Username must be at most 20 characters long"],
        unique: [true, "Username is already taken"],
    },
});

const User = models.User  || model("User", userSchema);
export default User;