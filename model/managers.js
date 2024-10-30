import mongoose, { Schema, model } from "mongoose";

const Managers = new Schema ({
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

export default model('Managers', Managers)