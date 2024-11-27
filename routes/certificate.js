import { Router } from "express";

import { verifyToken } from "../middleware/tokenVerification.js";

import {
    verifyCertificate,
    generateCertificate
} from "../controller/certificate.js";

const router = Router();

router.use('/generate', verifyToken);

router.route('/verify/:certificateID').get(verifyCertificate);

router.route('/generate').post(generateCertificate);

export default router;