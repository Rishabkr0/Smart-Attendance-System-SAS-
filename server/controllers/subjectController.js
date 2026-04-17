import Subject from '../models/Subject.js';

export const createSubject = async (req, res) => {
    try {
        const { name, code } = req.body;
        const subjectExists = await Subject.findOne({ code });
        if (subjectExists) {
            return res.status(400).json({ message: 'Subject already exists' });
        }
        const subject = await Subject.create({ name, code });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
