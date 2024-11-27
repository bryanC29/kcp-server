import { Router } from "express";

import { verifyToken } from "../middleware/tokenVerification.js";

import {
    allNotification,
    updateNotification
} from "../controller/notification.js";

const router = Router();

router.use('/all', verifyToken);
router.use('/update', verifyToken);

router.route('/all').get(allNotification);
router.route('/update').post(updateNotification);

export default router;