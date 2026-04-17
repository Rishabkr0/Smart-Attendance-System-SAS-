import Attendance from '../models/Attendance.js';
import Session from '../models/Session.js';

export const markAttendance = async (req, res) => {
    try {
        const { studentId, sessionId, subjectId } = req.body;

        // Check if session is active
        const session = await Session.findById(sessionId);
        if (!session || !session.isActive) {
            return res.status(400).json({ message: 'Session is not active' });
        }

        // Prevent duplicate attendance
        const alreadyMarked = await Attendance.findOne({ student: studentId, session: sessionId });
        if (alreadyMarked) {
            return res.status(400).json({ message: 'Attendance already marked for this session' });
        }

        const attendance = await Attendance.create({
            student: studentId,
            session: sessionId,
            subject: subjectId,
            status: 'Present'
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAttendance = async (req, res) => {
    try {
        // Fetch with student and session details
        const attendance = await Attendance.find({})
            .populate('student', 'name rollNumber')
            .populate('subject', 'name')
            .populate('session', 'startTime')
            .sort({ timestamp: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.params.studentId })
            .populate('subject', 'name')
            .populate('session', 'startTime')
            .sort({ timestamp: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
