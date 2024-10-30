import mongoose, { Schema, model } from "mongoose";

const Students = new Schema ({
    userID : {
        type: String,
        required: true,
    },
    courseEnrolled : {
        type: String,
        required: true,
    },
    timeAllotted : {
        type: Number,
        required: true,
    },
    certificates : [
        {
            type: String,
        }
    ],
    fee : [
        {
            month : {
                type: String,
            },
            amount : {
                type: Number,
            },
            notes : {
                type: String,
            }
        }
    ],
})

export default model('Students', Students)