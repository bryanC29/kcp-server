import mongoose, { Mongoose, Schema, model } from "mongoose";

const Users = new Schema ({
    userID : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    email : {
        type: String,
        required : true,
    },
    emailVerified : {
        type: Boolean,
        default : false,
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum: ['Student', 'Teacher', 'Manager', 'Admin'],
        default: 'Student',
    },
    contactNumber : {
        type : Number,
    },
    contactNumberVerified : {
        type : Boolean,
        default : false,
    },
    address : {
        type : String,
    },
    gender : {
        type : String,
    },
    dateOfBirth : {
        type: Date,
    },
    aadhar : {
        type : String,
    },
    highestEducation : {
        type: String,
    },
    leaves : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Leaves',
        }
    ],
    centre : {
        type: String,
        required: true,
    },
    dateOfJoining : {
        type: Date,
        default: Date.now,
    },
    accountStatus : {
        type: String,
        enum: ['Pending', 'New', 'Confirmed'],
        default: 'Pending',
    },
    bankDetail : {
        accNo : {
            type : String,
        },
        ifscCode : {
            type : String,
        },
        bankName : {
            type : String,
        },
        upiID : {
            type : String,
        },
    }
})

export default model('Users', Users);