
import {Schema, model } from 'mongoose';



const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensures no two users can have the same email
        trim: true, // Removes whitespace from both ends of a string
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password hash is required']
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = model('User', userSchema);

export default User;