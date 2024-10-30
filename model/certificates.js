import mongoose, { Schema, model } from "mongoose";

const Certificates = new Schema ({
    userID : {
        type: String,
        required: true,
    },
    course : {
        type: String,
    },
    dateIssued : {
        type: Date,
    },
}, { timestamps: true, })

export default model('Certificates', Certificates)