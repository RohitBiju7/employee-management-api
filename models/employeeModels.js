const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true,
        minlength: 3
    },

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true,
        min: 15000
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },

    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },

    joiningDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
});

module.exports = mongoose.model('Employee', employeeSchema);