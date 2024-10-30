import mongoose, { Schema, model } from "mongoose";

const Notifications = new Schema ({
    body : {
        type : String,
        required : true,
    },
    userID : {
        type : String,
        required: true,
    },
    readStatus : {
        type : Boolean,
        default : false,
    },
}, { timestamps: true, })

export default model('Notifications', Notifications)