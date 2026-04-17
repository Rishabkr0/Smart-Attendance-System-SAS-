import Student from '../models/Student.js';

export const registerStudent = async (req, res) => {
    try {
        const { name, rollNumber, course, faceDescriptors } = req.body;
        
        const studentExists = await Student.findOne({ rollNumber });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        
        const student = await Student.create({
            name,
            rollNumber,
            course,
            faceDescriptors
        });
        
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        
        student.name = req.body.name || student.name;
        student.rollNumber = req.body.rollNumber || student.rollNumber;
        student.course = req.body.course || student.course;
        
        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
