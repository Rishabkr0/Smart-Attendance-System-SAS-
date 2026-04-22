import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from './models/Subject.js';

dotenv.config();

const addSubject = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const exists = await Subject.findOne({ code: 'ULT2001' });
        if (exists) {
            console.log('⚠️ Subject ULT2001 already exists.');
        } else {
            await Subject.create({
                name: 'ULT 2001',
                code: 'ULT2001'
            });
            console.log('✅ Subject "ULT 2001" added successfully!');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding subject:', error);
        process.exit(1);
    }
};

addSubject();
