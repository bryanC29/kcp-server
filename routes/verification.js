import { Router } from "express";

import { verifyToken } from "../middleware/tokenVerification.js";

import {
    verifyEmail,
    verifyUser,
    requestEmailVerify,
    requestNumberVerify,
    validateOTP,
    aadharAuth
} from "../controller/verification.js";

const router = Router();

router.use('/email', verifyToken);
router.use('/number', verifyToken);
router.use('/aadhar', verifyToken);

router.route('/email/:token').get(verifyEmail);
router.route('/user/:userID').get(verifyUser);

router.route('/email').post(requestEmailVerify);
router.route('/number').post(requestNumberVerify);
router.route('/otp').post(validateOTP);
router.route('/aadhar').post(aadharAuth);

export default router;