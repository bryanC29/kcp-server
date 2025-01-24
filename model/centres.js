import mongoose, { Schema, model } from "mongoose";

const Centres = new Schema ({
    centreID : {
        type: String,
        required: true,
    },
    address : {
        type: String,
    },
    adminID : {
        type: String,
    },
    managerID : {
        type: String,
    },
    teachers : [
        {
            type: String,
        }
    ],
    students : [
        {
            type: String,
        }
    ],
    devices : [
        {
            type: String,
        }
    ],
})

export default model('Centres', Centres)