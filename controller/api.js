import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Devices from "../model/devices.js";
import Notices from "../model/notices.js";
import Users from '../model/users.js';

export const allTrustedNotice = async (req, res) => {
    try {
        const newNotices = await Notices.find({ type: 'public' });
        return res.status(200).json(newNotices);
    }
    
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Notices cannot be fetched at this moment" });
    }
}

export const deviceRegister = async (req, res) => {
    const { mac, centreID } = req.body;

    try {
        const existingDevice = await Devices.findOne({ MACAddress: mac });

        if(existingDevice) {
            return res.status(400).json({ message: 'Failed to register device. Please try again later' });
        }

        const newDevice = new Devices({
            MACAddress: mac,
            centreID: centreID
        })

        await newDevice.save();
        
        if(!newDevice) {
            return res.status(400).json({ message: 'Failed to register device. Please try again' });
        }

        const token = jwt.sign({
            MACAddress: newDevice.MACAddress,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })

        res.setHeader('Authorization', `Bearer ${token}`);

        res.cookie('deviceToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(201).json({ message: 'Device registered successfully' });
    }

    catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'Device could not be registered' })
    }
}

export const deviceLogin = async (req, res) => {
    const { mac, centreID } = req.body;
    
    if(!mac || !centreID)
        return res.status(400).json({ message: 'MAC Address and CentreID are required' });
    
    try {
        const device = await Devices.findOne({ MACAddress: mac });
    
        if(!device)
            return res.status(400).json({ message: 'Invalid MAC Address' });
    
        const token = jwt.sign({
            id: device._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })
    
        res.setHeader('Authorization', `Bearer ${token}`);
        res.cookie('deviceToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    
        res.status(200).json({ message: 'Login successfull' });
    }
    
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error while logging in' });
    }
}

export const deviceUserAuth = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password)
        return res.status(400).json({ message: 'Email and password are required' });

    try {
        const user = await Users.findOne({ username: email });

        if(!(user && (await bcrypt.compare(password, user.password))))
            return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })

        res.setHeader('Authorization', `Bearer ${token}`);
        res.cookie('userToken', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        })

        res.status(200).json({ message: 'Login successfull' });
    }

    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error while logging in' });
    }
}

export const deviceDeauth = async (req, res) => {
    try{
        res.clearCookie('deviceToken');
        res.status(200).json({ message: 'Device deauthentication successfull' });
    }

    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error during logout' });
    }
}

export const deviceUserLogout = async (req, res) => {
    try{
        res.clearCookie('userToken');
        res.status(200).json({ message: 'User logout successfull' });
    }
    
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error during logout' });
    }
}