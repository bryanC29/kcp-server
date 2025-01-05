import mongoose, { Schema, model } from "mongoose";

const Teachers = new Schema ({
    userID : {
        type: String,
        required: true,
    },
    courseTeaching : {
        type: String,
    },
    specialization : {
        type: String,
    },
    salary : [
        {
            issueDate : {
                type: Date,
            },
            amount : {
                type: Number,
            },
            bonus : {
                type: Number,
            },
        }
    ],
    yearsOfExperience : {
        type: Number,
        default: 0,
    },
    timingsAllotted : [
        {
            type: Number,
        }
    ],
})

export default model('Teachers', Teachers)