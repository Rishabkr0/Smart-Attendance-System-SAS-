import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Attendance from './models/Attendance.js';
import Session from './models/Session.js';
import Student from './models/Student.js';
import Subject from './models/Subject.js';

dotenv.config();

const clearDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for clearing...');

        await Admin.deleteMany({});
        await Attendance.deleteMany({});
        await Session.deleteMany({});
        await Student.deleteMany({});
        await Subject.deleteMany({});

        console.log('✅ All database collections have been cleared!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
};

clearDB();
