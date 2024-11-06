import { Router } from "express";

import {
    allTrustedNotice,
    deviceRegister,
    deviceLogin,
    deviceUserAuth,
    deviceDeauth,
    deviceUserLogout
} from "../controller/api.js";

const router = Router();

router.route('/notice').get(allTrustedNotice);
router.route('/deauth').get(deviceUserLogout);
router.route('/logout').get(deviceDeauth);

router.route('/add').post(deviceRegister);
router.route('/login').post(deviceLogin);
router.route('/auth').post(deviceUserAuth);

export default router;