import mongoose, { Schema, model } from "mongoose";

const Students = new Schema ({
    userID : {
        type: String,
        required: true,
    },
    courseEnrolled : [
        {
            courseID : {
                type: String,
            },
            courseStart : {
                type: String,
            },
            courseEnd : {
                type: String,
            },
        }
    ],
    timeAllotted : {
        type: Number,
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