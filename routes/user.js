import { Router } from "express";

import {
    login,
    logout,
    register,
    forgotPassword,
    getProfile,
    getAdminProfile,
    getManagerProfile,
    getTeacherProfile,
    getStudentProfile,
    getBankDetails,
    userProfileUpdate,
    userBankDetailUpdate,
    userPasswordUpdate
} from "../controller/user.js";

const router = Router();

router.route('/profile').get(getProfile);
router.route('/admin').get(getAdminProfile);
router.route('/manager').get(getManagerProfile);
router.route('/teacher').get(getTeacherProfile);
router.route('/student').get(getStudentProfile);
router.route('/bankdetails').get(getBankDetails);
router.route('/logout').get(logout);

router.route('/register').post(register);
router.route('/passwordreset').post(forgotPassword);
router.route('/profileupdate').post(userProfileUpdate);
router.route('/updatebank').post(userBankDetailUpdate);
router.route('/updatepassword').post(userPasswordUpdate);
router.route('/login').post(login);

export default router;