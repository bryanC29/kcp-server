import { Router } from "express";

import { verifyToken } from "../middleware/tokenVerification.js";

import {
    allPublicNotice,
    allNotice,
    createNotice,
    editNotice,
    deleteNotice
} from "../controller/notice.js";

const router = Router();

router.use('/create', verifyToken);
router.use('/edit', verifyToken);
router.use('/delete', verifyToken);

router.route('/public').get(allPublicNotice);
router.route('/all').get(allNotice);

router.route('/create').post(createNotice);
router.route('/edit').post(editNotice);
router.route('/delete').post(deleteNotice);

export default router;