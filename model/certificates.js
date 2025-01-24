import mongoose, { Schema, model } from "mongoose";

const Certificates = new Schema ({
    userID : {
        type: String,
        required: true,
    },
    courseID : {
        type: String,
    },
    dateIssued : {
        type: String,
    },
}, { timestamps: true, })

export default model('Certificates', Certificates)