const express = require('express');
const router = express.Router();
const employeeModel = require('../models/employeeModels');


// get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await employeeModel.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// add a new employee
router.post('/', async (req, res) => {

    const { 
        employeeId, 
        fullName, 
        department, 
        designation, 
        salary, 
        email, 
        phone, 
        joiningDate, 
        status 
    } = req.body;

    const employee = new employeeModel({
        employeeId,
        fullName,
        department,
        designation,
        salary,
        email,
        phone,
        joiningDate,
        status
    });

    try {
        const savedEmployee = await employee.save();

        res.status(201).json({
            message: "Employee added successfully",
            employee: savedEmployee
        });

    } catch (error) {

        // Duplicate employeeId or email
        if (error.code === 11000) {

            if (error.keyPattern.employeeId) {
                return res.status(400).json({
                    message: "Employee ID already exists"
                });
            }

            if (error.keyPattern.email) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }
        }


        // Mongoose validation errors
        if (error.name === "ValidationError") {

            if (error.errors.employeeId) {
                return res.status(400).json({
                    message: "Employee ID is required"
                });
            }

            if (error.errors.fullName) {
                return res.status(400).json({
                    message: "Name must contain at least 3 characters"
                });
            }

            if (error.errors.department) {
                return res.status(400).json({
                    message: "Department is required"
                });
            }

            if (error.errors.salary) {
                return res.status(400).json({
                    message: "Salary must be at least ₹15000"
                });
            }

            if (error.errors.email) {
                return res.status(400).json({
                    message: "Enter a valid email address"
                });
            }

            if (error.errors.phone) {
                return res.status(400).json({
                    message: "Invalid phone number"
                });
            }

            if (error.errors.status) {
                return res.status(400).json({
                    message: "Invalid employee status"
                });
            }
        }


        // Other errors
        res.status(400).json({
            message: error.message
        });
    }
});


// get employee by id
router.get('/:employeeId', async (req, res) => {
    try {
        const employee = await employeeModel.findOne({
            employeeId: req.params.employeeId
        });

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.json(employee);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// update employee
router.put('/:employeeId', async (req, res) => {
    try {
        const updatedEmployee = await employeeModel.findOneAndUpdate(
            { employeeId: req.params.employeeId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee updated successfully",
            employee: updatedEmployee
        });

    } catch (error) {

        // Duplicate employeeId or email
        if (error.code === 11000) {

            if (error.keyPattern.employeeId) {
                return res.status(400).json({
                    message: "Employee ID already exists"
                });
            }

            if (error.keyPattern.email) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }
        }


        // Mongoose validation errors
        if (error.name === "ValidationError") {

            if (error.errors.employeeId) {
                return res.status(400).json({
                    message: "Employee ID is required"
                });
            }

            if (error.errors.fullName) {
                return res.status(400).json({
                    message: "Name must contain at least 3 characters"
                });
            }

            if (error.errors.department) {
                return res.status(400).json({
                    message: "Department is required"
                });
            }

            if (error.errors.designation) {
                return res.status(400).json({
                    message: "Designation is required"
                });
            }

            if (error.errors.salary) {
                return res.status(400).json({
                    message: "Salary must be at least ₹15000"
                });
            }

            if (error.errors.email) {
                return res.status(400).json({
                    message: "Enter a valid email address"
                });
            }

            if (error.errors.phone) {
                return res.status(400).json({
                    message: "Invalid phone number"
                });
            }

            if (error.errors.joiningDate) {
                return res.status(400).json({
                    message: "Joining date is required"
                });
            }

            if (error.errors.status) {
                return res.status(400).json({
                    message: "Invalid employee status"
                });
            }
        }


        res.status(400).json({
            message: error.message
        });
    }
});

// delete employee
router.delete('/:employeeId', async (req, res) => {
    try {
        const deletedEmployee = await employeeModel.findOneAndDelete({employeeId: req.params.employeeId},
            req.body,
            {
                new: true,
                runValidators:true
            }
        );

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully'
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;