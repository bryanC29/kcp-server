import certificates from "../model/certificates.js"

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
            return res.status(200).json({ message: "Certificate found", certificate });
        }
    }

    catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Error verifying certificate" });
    }
}

export const generateCertificate = async (req, res) => {
    const { userID, course, role } = req.body;

    try {
        const oldCertificate = await certificates.findOne({ userID: userID })

        if(!oldCertificate && !(oldCertificate.course == course)) {
            const newCertificate = new certificates({
                userID,
                course,
            })
        
            await newCertificate.save();
        
            if(!newCertificate) {
                return res.status(400).json({ message: "Failed to generate certificate" });
            } else {
                return res.status(201).json({ message: "Certificate generated successfully", certificateID: newCertificate._id });
            }

        } else {
            return res.status(400).json({ message: "User already has a certificate for this course" })
        }
    }

    catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Error generating certificate. Please try again later" });
    }
}