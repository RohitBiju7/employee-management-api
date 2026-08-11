const express = require("express");
const router = express.Router();
const employeeModel = require("../models/employeeModels");

// Helper function to handle duplicate key errors
function handleDuplicateKeyError(error, res) {
  if (error.keyPattern?.employeeId) {
    return res.status(400).json({ message: "Employee ID already exists" });
  }
  if (error.keyPattern?.email) {
    return res.status(400).json({ message: "Email already registered" });
  }
  return false;
}

// Custom error messages for Mongoose validation fields
const validationMessages = {
  employeeId: "Employee ID is required",
  fullName: "Name must contain at least 3 characters",
  department: "Department is required",
  designation: "Designation is required",
  salary: "Salary must be at least ₹15000",
  email: "Enter a valid email address",
  phone: "Invalid phone number",
  joiningDate: "Joining date is required",
  status: "Invalid employee status",
};

// Helper function to handle Mongoose validation errors
function handleValidationError(error, res) {
  for (const field in error.errors) {
    if (validationMessages[field]) {
      return res.status(400).json({ message: validationMessages[field] });
    }
  }
  return false;
}

// Centralized error responder
function handleRouteError(error, res) {
  if (error.code === 11000 && handleDuplicateKeyError(error, res)) {
    return;
  }
  if (error.name === "ValidationError" && handleValidationError(error, res)) {
    return;
  }
  res.status(400).json({ message: error.message });
}

// get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await employeeModel.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add a new employee
router.post("/", async (req, res) => {
  try {
    const employee = new employeeModel(req.body);
    const savedEmployee = await employee.save();

    res.status(201).json({
      message: "Employee added successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    handleRouteError(error, res);
  }
});

// get employee by id
router.get("/:employeeId", async (req, res) => {
  try {
    const employee = await employeeModel.findOne({
      employeeId: req.params.employeeId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update employee
router.put("/:employeeId", async (req, res) => {
  try {
    const updatedEmployee = await employeeModel.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    handleRouteError(error, res);
  }
});

// delete employee
router.delete("/:employeeId", async (req, res) => {
  try {
    const deletedEmployee = await employeeModel.findOneAndDelete(
      { employeeId: req.params.employeeId }
    );

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;