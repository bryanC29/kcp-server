import { Router } from "express";

import {
    allLeaves,
    watchLeaves,
    status,
    approveLeave,
    declineLeave,
    applyLeave
} from "../controller/leave.js";

const router = Router();

router.route('/all').get(allLeaves);
router.route('/watch').get(watchLeaves);
router.route('/status').get(status);

router.route('/approve').post(approveLeave);
router.route('/decline').post(declineLeave);
router.route('/apply').post(applyLeave);

export default router;