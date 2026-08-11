const express = require('express');
const app = express();
const port = 3000;

app.disable('x-powered-by');

require('dotenv').config();

const employeeRoute = require('./routes/employeeRoutes');
const db = require('./connection');

// Connect to MongoDB
db();

// Middleware
app.use(express.json());

// Employee API routes
app.use('/api/employees', employeeRoute);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});