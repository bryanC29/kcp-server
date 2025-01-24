import mongoose, { Schema, model } from "mongoose";

const Courses = new Schema ({
    name : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    duration : {
        type: String,
        required: true
    },
    fee : {
        type: Number,
        required: true
    },
    image : {
        type: String,
        required: true
    },
})

export default model('Courses', Courses)