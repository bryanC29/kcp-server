import mongoose, { Schema, model } from "mongoose";

const Assets = new Schema ({
    title : {
        type: String,
    },
    assetLocation : {
        type: String,
    },
    assetType : {
        type: String,
        enum: ['picture', 'video', 'icon', 'audio', 'other'],
    },
    assetRole : {
        type: String,
        enum: ['public', 'internal', 'special'],
        default: 'public',
    },
})

export default model('Assets', Assets)