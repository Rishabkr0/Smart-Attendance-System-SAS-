import express from 'express';
import { registerAdmin, authAdmin, authStudent } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', authAdmin);
router.post('/student-login', authStudent);

export default router;
