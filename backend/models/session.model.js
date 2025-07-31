const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String], 
        default: []
    },
    json_file_url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'], 
        default: 'draft'
    }
}, {
    
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
