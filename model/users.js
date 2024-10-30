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
    }
})

export default model('Users', Users);