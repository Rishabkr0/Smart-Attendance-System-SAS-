import express from 'express';
import { startSession, endSession, getActiveSessions } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, startSession).get(protect, getActiveSessions);
router.route('/:id/end').put(protect, endSession);

export default router;
