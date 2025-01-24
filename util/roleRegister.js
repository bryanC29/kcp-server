import Students from "../model/students.js";
import Admins from "../model/admins.js";

export const registerStudent = async (uid) => {
    const student = new Students({
        userID: uid,
    });
    await student.save();
}

export const registerAdmin = async (uid) => {
    const admin = new Admins({
        userID: uid,
    });
    await admin.save();
}