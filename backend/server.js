const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/Auth'); // Auth routes import kiye
const employeeRoutes = require('./routes/Employees');
const attendanceRoutes = require('./routes/Attendance');
const departmentRoutes = require('./routes/Departments');
const payrollRoutes = require('./routes/Payroll');
const dashboardRoutes = require('./routes/Dashboard');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/EMS_Database';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));
app.get('/', (req, res) => {
  res.send('EMS Backend is running successfully! 🚀');
});
// Routes Mapping
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
});