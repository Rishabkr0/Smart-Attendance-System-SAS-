import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Subject from './models/Subject.js';
import Session from './models/Session.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Admin.deleteMany({});
        await Subject.deleteMany({});
        await Session.deleteMany({});
        await Student.deleteMany({});
        await Attendance.deleteMany({});

        // Create Admin
        await Admin.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('✅ Admin Created: admin@example.com / password123');

        // Create a default Subject
        const subject = await Subject.create({
            name: 'Computer Science 101',
            code: 'CS101'
        });
        console.log('✅ Default Subject Created: CS101');

        // Create an active session for today
        await Session.create({
            subject: subject._id,
            startTime: new Date(),
            isActive: true
        });
        console.log('✅ Active Session Created for CS101');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
