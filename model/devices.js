import mongoose, { Schema, model } from "mongoose";

const Devices = new Schema ({
    MACAddress : {
        type: String,
        required: true,
    },
    centreID : {
        type: String,
        required: true,
    },
})

export default model('Devices', Devices)