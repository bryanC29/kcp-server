import mongoose, { Schema, model } from "mongoose";

const Leaves = new Schema ({
    userID : {
        type : String,
        required : true,
    },
    leaveType : {
        type : String,
        required : true,
        enum: ['Medical', 'Paid', 'Emergency', 'Casual']
    },
    leaveDate : {
        type : Date,
    },
    leaveStatus : {
        type : String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    leaveReason : {
        type : String,
    },
})

export default model('Leaves', Leaves)