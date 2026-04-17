import express from 'express';
import { markAttendance, getAttendance, getStudentAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, markAttendance).get(protect, getAttendance);
router.route('/student/:studentId').get(getStudentAttendance);

export default router;
