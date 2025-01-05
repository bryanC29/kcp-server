import Students from "../model/students.js";
import Teachers from "../model/teachers.js";
import Managers from "../model/managers.js";
import Admins from "../model/admins.js";

export const registerStudent = async (uid) => {
    const student = new Students({
        userID: uid,
    });
    await student.save();
}

export const registerTeacher = async (uid) => {
    const teacher = new Teachers({
        userID: uid,
    });
    await teacher.save();
}

export const registerManager = async (uid) => {
    const manager = new Managers({
        userID: uid,
    });
    await manager.save();
}

export const registerAdmin = async (uid) => {
    const admin = new Admins({
        userID: uid,
    });
    await admin.save();
}