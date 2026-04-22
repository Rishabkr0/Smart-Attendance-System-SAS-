import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const addAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'admin@gmail.com';
        const exists = await Admin.findOne({ email });

        if (exists) {
            console.log(`⚠️ Admin ${email} already exists. Updating password...`);
            exists.password = 'admin123';
            await exists.save();
            console.log('✅ Password updated successfully!');
        } else {
            await Admin.create({
                name: 'System Admin',
                email: email,
                password: 'admin123'
            });
            console.log(`✅ Admin ${email} created successfully!`);
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding admin:', error);
        process.exit(1);
    }
};

addAdmin();
