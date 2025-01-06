import { Router } from "express";
import {
    createCentre,
    getAllCentres,
    getCentreById,
    addDevice,
    addTeacher,
    addStudent,
} from "../controller/centre.js";

import {
    verifyAdmin,
    verifyManager,
} from "../middleware/roleVerification.js";

const router = Router();

router.use('/create', verifyAdmin);
router.use('/all', verifyAdmin);

router.use('/get/:centreID', verifyManager);
router.use('/addDevice', verifyManager);
router.use('/addTeacher', verifyManager);
router.use('/addStudent', verifyManager);

router.route('/create').post(createCentre);
router.route('/all').get(getAllCentres);
router.route('/get/:centreID').get(getCentreById);

router.route('/addDevice').post(addDevice);
router.route('/addTeacher').post(addTeacher);
router.route('/addStudent').post(addStudent);

export default router;