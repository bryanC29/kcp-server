import { Router } from "express";

import { verifyToken } from "../middleware/tokenVerification.js";

import {
    allLeaves,
    watchLeaves,
    status,
    approveLeave,
    declineLeave,
    applyLeave
} from "../controller/leave.js";

const router = Router();

router.use('/all', verifyToken);
router.use('/watch', verifyToken);
router.use('/status', verifyToken);
router.use('/approve', verifyToken);
router.use('/decline', verifyToken);
router.use('/apply', verifyToken);

router.route('/all').get(allLeaves);
router.route('/watch').get(watchLeaves);
router.route('/status').get(status);

router.route('/approve').post(approveLeave);
router.route('/decline').post(declineLeave);
router.route('/apply').post(applyLeave);

export default router;