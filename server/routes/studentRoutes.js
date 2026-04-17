import express from 'express';
import { registerStudent, getStudents, deleteStudent, updateStudent } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerStudent).get(protect, getStudents);
router.route('/:id').delete(protect, deleteStudent).put(protect, updateStudent);

export default router;
