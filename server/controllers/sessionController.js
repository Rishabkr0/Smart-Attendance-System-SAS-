import Session from '../models/Session.js';

export const startSession = async (req, res) => {
    try {
        const { subjectId } = req.body;
        const activeSession = await Session.findOne({ subject: subjectId, isActive: true });
        
        if (activeSession) {
            return res.status(400).json({ message: 'Session already active for this subject' });
        }
        
        const session = await Session.create({ subject: subjectId });
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const endSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (session) {
            session.isActive = false;
            session.endTime = Date.now();
            await session.save();
            res.json(session);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActiveSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ isActive: true }).populate('subject');
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
