import mongoose, { Schema, model } from "mongoose";

const Transactions = new Schema ({
    transactionDate : {
        type : Date,
        required: true,
    },
    transactionStatus : {
        type : String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    transactionAmount : {
        type : Number,
        required: true,
    },
    userID : {
        type: String,
        required: true,
    },
    notes : {
        type : String,
    },
}, { timestamps: true, })

export default model('Transactions', Transactions)