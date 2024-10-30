import mongoose, { Schema, model } from "mongoose";

const Admins = new Schema ({
    userID : {
        type: String,
        required: true,
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
    ]
})

export default model('Admins', Admins)