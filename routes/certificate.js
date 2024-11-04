import { Router } from "express";

import {
    verifyCertificate,
    generateCertificate
} from "../controller/certificate.js";

const router = Router();

router.route('/verify/:certificateID').get(verifyCertificate);

router.route('/generate').post(generateCertificate);

export default router;