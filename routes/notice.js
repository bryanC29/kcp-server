import { Router } from "express";

import {
    allPublicNotice,
    allNotice,
    createNotice,
    editNotice,
    deleteNotice
} from "../controller/notice.js";

const router = Router();

router.route('/public').get(allPublicNotice);
router.route('/all').get(allNotice);

router.route('/create').post(createNotice);
router.route('/edit').post(editNotice);
router.route('/delete').post(deleteNotice);

export default router;