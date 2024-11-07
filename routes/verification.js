import { Router } from "express";

import {
    verifyEmail,
    verifyUser,
    requestEmailVerify,
    requestNumberVerify,
    validateOTP,
    aadharAuth
} from "../controller/verification.js";

const router = Router();

router.route('/email/:token').get(verifyEmail);
router.route('/user/:userID').get(verifyUser);

router.route('/email').post(requestEmailVerify);
router.route('/number').post(requestNumberVerify);
router.route('/otp').post(validateOTP);
router.route('/aadhar').post(aadharAuth);

export default router;