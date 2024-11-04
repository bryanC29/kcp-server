import mongoose, { Schema, model } from "mongoose";

const Notices = new Schema ({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    type : {
        type: String,
        enum: ['public', 'closed', 'authority'],
        default: 'public',
    }
}, { timestamps: true })

export default model('Notices', Notices)