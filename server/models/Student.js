import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true
    },
    faceDescriptors: {
        type: [[Number]],
        required: true,
        default: []
    }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
