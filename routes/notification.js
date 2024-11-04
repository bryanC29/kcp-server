import { Router } from "express";

import {
    allNotification,
    updateNotification
} from "../controller/notification.js";

const router = Router();

router.route('/all').get(allNotification);
router.route('/update').post(updateNotification);

export default router;