import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
    // This field links a session to the user who created it.
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Creates a reference to the 'User' model
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String], // Defines an array of strings
        default: []
    },
    json_file_url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'], // Restricts the value to one of these two options
        default: 'draft'
    }
}, {
    // This option automatically creates and manages:
    // - createdAt (maps to 'created_at' in the PDF)
    // - updatedAt (maps to 'updated_at' in the PDF)
    timestamps: true
});

const Session = model('Session', sessionSchema);

export default Session;