import Centres from '../model/centres.js';

import { centreIdGen } from '../util/idGen.js';

export const createCentre = async (req, res) => {
    try {
        const { address, city, admin } = req.body;
        const centreID = centreIdGen(city ? city : 'New Delhi');
        const newCentre = new Centres({
            centreID,
            address,
            admin,
        });
        await newCentre.save();
        res.status(201).json(newCentre);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getCentres = async (req, res) => {
    try {
        const centres = await Centres.find();
        res.status(200).json(centres);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}