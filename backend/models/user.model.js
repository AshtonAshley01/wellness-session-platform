const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    // Changed 'password' to 'password_hash' to match assignment
    password_hash: {
        type: String,
        required: [true, 'Password hash is required']
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

// Changed from 'export default' to 'module.exports'
module.exports = User;
