import Centres from '../model/centres.js';
import Teachers from '../model/teachers.js';
import Students from '../model/students.js';

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

export const getAllCentres = async (req, res) => {
    try {
        const centres = await Centres.find();
        res.status(200).json(centres);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getCentreById = async (req, res) => {
    try {
        const { centreID } = req.params;
        
        const centre = await Centres.findOne ({ centreID });
        
        res.status(200).json(centre);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const addDevice = async (req, res) => {
    try {
        const { centreID, deviceID } = req.body;

        const centre = await Centres.findOne ({ centreID });
        
        if (!centre) {
            return res.status(404).json({ message: 'Centre not found' });
        }

        centre.devices.push(deviceID);
        await centre.save();
        
        res.status(201).json(centre);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const addTeacher = async (req, res) => {
    try {
        const { centreID, teacherID } = req.body;

        const centre = await Centres.findOne ({ centreID });
        const teacher = await Teachers.findOne ({ teacherID });

        if (!centre) {
            return res.status(404).json({ message: 'Centre not found' });
        }
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        centre.teachers.push(teacherID);
        await centre.save();

        res.status(201).json(centre);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const addStudent = async (req, res) => {
    try {
        const { centreID, studentID } = req.body;

        const centre = await Centres.findOne ({ centreID });
        const student = await Students.findOne ({ studentID });

        if (!centre) {
            return res.status(404).json({ message: 'Centre not found' });
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        centre.students.push(studentID);
        await centre.save();

        res.status(201).json(centre);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}