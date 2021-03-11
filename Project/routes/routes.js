import { Router } from "../deps.js";
import * as logController from "./controllers/logController.js";
import * as userController from "./controllers/userController.js";
import * as summaryController from "./controllers/summaryController.js";
import * as logApi from "./apis/logApi.js";

const router = new Router();

router.post('/behavior/reporting/morning',logController.addMorning)
router.get('/behavior/reporting/morning',logController.morning)
router.get('/behavior/reporting', logController.reporting)

router.post('/behavior/reporting/evening',logController.addEvening)
router.get('/behavior/reporting/evening',logController.evening)

router.get('/',summaryController.lastTwoDays)

router.get('/behavior/summary',summaryController.stats)
router.post('/behavior/summary',summaryController.statsPost)

router.get('/auth/registration', userController.showreg)
router.get('/auth/login', userController.showlogin)
router.post('/auth/registration', userController.register)
router.post('/auth/login', userController.login)

router.get('/api/summary/',logApi.last7days)
router.get('/api/summary/:year/:month/:day', logApi.getDay)

router.get('/auth/logout',userController.showLogout)
router.post('/auth/logout',userController.logout)


export { router };