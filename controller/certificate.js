import certificates from "../model/certificates.js";
import Users from "../model/users.js";
import Students from "../model/students.js";

import { genVerifyCertificate } from "../util/certificate.js";

export const verifyCertificate = async (req, res) => {
    const { certificateID } = req.params;

    if(!certificateID) {
        return res.status(400).json({ message: "Certificate ID is required" });
    }
    
    try {
        const certificate = await certificates.findOne({ _id: certificateID });
        
        if(!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        } else {
            const user = await Users.findOne({ userID: certificate.userID });
            const student = await Students.findOne({ userID: certificate.userID });
            const course = student.courseEnrolled.find(c => c.courseID == certificate.course);
            const certificateObj = {
                certificateID: certificate._id,
                course: certificate.course,
                name: user.name,
                start: course.courseStart,
                end: course.courseEnd,
                date: certificate.dateIssued,
            }

            const certificateImage = await genVerifyCertificate(certificateObj);

            return res.status(200).json({ message: "Certificate found", certificate: certificateImage });
        }
    }

    catch(err) {
        console.error(err)
        return res.status(500).json({ message: "Error verifying certificate" });
    }
}

export const generateCertificate = async (req, res) => {
    const { studentID, course, dateIssued } = req.body;
    const { userID } = req.user;

    try {
        const oldCertificate = await certificates.findOne({ userID: studentID });
        const student = await Students.findOne({ userID: studentID });

        if(!oldCertificate || !(oldCertificate.course == course)) {
            const newCertificate = new certificates({
                userID: studentID,
                course,
                dateIssued,
            })
        
            await newCertificate.save();
        
            if(!newCertificate) {
                return res.status(400).json({ message: "Failed to generate certificate" });
            } else {
                student.certificates.push(newCertificate._id);
                await student.save();
                return res.status(201).json({ message: "Certificate generated successfully", certificateID: newCertificate._id });
            }

        } else {
            return res.status(400).json({ message: "User already has a certificate for this course" })
        }
    }

    catch(err) {
        console.error(err)
        return res.status(500).json({ message: "Error generating certificate. Please try again later" });
    }
}