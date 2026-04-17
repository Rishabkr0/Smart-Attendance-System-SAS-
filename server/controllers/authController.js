import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
        name,
        email,
        password
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

export const authAdmin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

export const authStudent = async (req, res) => {
    const { rollNumber, name } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (student && student.name.toLowerCase() === name.toLowerCase()) {
        res.json({
            _id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            course: student.course,
            token: generateToken(student._id),
            role: 'student'
        });
    } else {
        res.status(401).json({ message: 'Invalid Roll Number or Student Identity Name' });
    }
};
