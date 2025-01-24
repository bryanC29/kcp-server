import { Router } from "express";
import { verifyToken } from "../middleware/tokenVerification.js";

import {
    verifyAdmin
} from "../middleware/roleVerification.js";

import {
    login,
    logout,
    register,
    forgotPassword,
    getProfile,
    getAdminProfile,
    getBankDetails,
    userProfileUpdate,
    userBankDetailUpdate,
    userPasswordUpdate
} from "../controller/user.js";

const router = Router();

router.use('/profile', verifyToken);
router.use('/admin', verifyAdmin);
router.use('/bankdetails', verifyToken);
router.use('/profileupdate', verifyToken);
router.use('/updatebank', verifyToken);
router.use('/updatepassword', verifyToken);

router.route('/logout').get(logout);

router.route('/register').post(register);
router.route('/passwordreset').post(forgotPassword);
router.route('/login').post(login);

router.route('/profile').get(getProfile);
router.route('/admin').get(getAdminProfile);
router.route('/bankdetails').get(getBankDetails);

router.route('/profileupdate').post(userProfileUpdate);
router.route('/updatebank').post(userBankDetailUpdate);
router.route('/updatepassword').post(userPasswordUpdate);

export default router;