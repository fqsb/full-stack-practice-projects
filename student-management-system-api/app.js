require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');
const classRoutes = require('./routes/classRoutes');
const app = express();

// 中间件
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);

// 连接 MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management_dev');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接失败:'));
db.once('open', () => {
  console.log('MongoDB 连接成功！');
});

module.exports = app;
