import Certificates from "../model/certificates.js";
import Students from "../model/students.js";
import Users from "../model/users.js";
import Courses from "../model/courses.js";

import { genVerifyCertificate } from "../util/certificate.js";

export const verifyCertificate = async (req, res) => {
    const { certificateID } = req.params;

    if(!certificateID) {
        return res.status(400).json({ message: "Certificate ID is required" });
    }
    
    try {
        const certificate = await Certificates.findOne({ _id: certificateID });

        if(!certificate)
            return res.status(404).json({ message: "Certificate not found" });

        const user = await Users.findOne({ userID: certificate.userID });

        const student = await Students.findOne({ userID: certificate.userID });

        const course = await Courses.findOne({ _id: certificate.courseID });

        if (!user || !student || !course) {
            return res.status(404).json({ message: "User, student, or course not found" });
        }

        const enrolledCourse = student.courseEnrolled.find(c => c.name === course.name);

        if (!enrolledCourse) {
            return res.status(404).json({ message: "Course enrollment not found" });
        }

        const data = {
            certificateID: certificate.id,
            name: user.name,
            course: certificate.courseID,
            start: enrolledCourse.start,
            end: enrolledCourse.end,
            date: certificate.dateIssued,
        };
        const verification = await genVerifyCertificate(data);

        return res.status(200).json({ message: "Certificate found", verification: verification.toString('base64') });
    }

    catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Error verifying certificate" });
    }
}

export const generateCertificate = async (req, res) => {
    const { userID, courseID, end, dateIssued } = req.body;

    try {
        const oldCertificate = await Certificates.findOne({ userID: userID })

        if(oldCertificate && oldCertificate.courseID == courseID)
            return res.status(400).json({ message: "User already has a certificate for this course" });

        const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        const date = new Date();
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const today = `${day} ${month}, ${year}`;

        const newCertificate = new Certificates({
            userID,
            courseID,
            dateIssued: dateIssued ? dateIssued : today,
        })
    
        await newCertificate.save();

        if (end) {
            await Students.updateOne(
                { userID: userID, "courseEnrolled.courseID": courseID },
                { $set: { "courseEnrolled.$.courseEnd": end } }
            );
            
        } else {
            await Students.updateOne(
                { userID: userID, "courseEnrolled.courseID": courseID },
                { $set: { "courseEnrolled.$.courseEnd": today } }
            );
        }
    
        if(!newCertificate) {
            return res.status(400).json({ message: "Failed to generate certificate" });
        } else {
            return res.status(201).json({ message: "Certificate generated successfully", certificateID: newCertificate._id });
        }
    }

    catch(err) {
        return res.status(500).json({ message: "Error generating certificate. Please try again later" });
    }
}