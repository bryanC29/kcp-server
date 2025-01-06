import { Router } from "express";
import { createCentre, getCentres } from "../controller/centre.js";

import { verifyAdmin } from "../middleware/roleVerification.js";

const router = Router();

router.use('/create', verifyAdmin);
router.use('/get', verifyAdmin);

router.route('/create').post(createCentre);
router.route('/get').get(getCentres);

export default router;