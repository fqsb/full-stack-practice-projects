require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const ActivityType = require('../models/ActivityType');
const Activity = require('../models/Activity');

// 连接数据库
connectDB();

// 清空现有数据
const clearData = async () => {
  await User.deleteMany({});
  await ActivityType.deleteMany({});
  await Activity.deleteMany({});
  console.log('Existing data cleared');
};

// 创建测试用户
const createUsers = async () => {
  const users = [
    {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      email: 'admin@school.edu',
      role: 'admin',
      profile: {
        name: 'Admin User',
        department: 'Administration'
      }
    },
    {
      username: 'teacher1',
      password: await bcrypt.hash('teacher123', 10),
      email: 'teacher1@school.edu',
      role: 'teacher',
      profile: {
        name: 'Teacher One',
        department: 'Computer Science'
      }
    },
    {
      username: 'student1',
      password: await bcrypt.hash('student123', 10),
      email: 'student1@school.edu',
      role: 'student',
      profile: {
        name: 'Student One',
        studentId: 'S001',
        department: 'Computer Science',
        grade: 'Sophomore'
      }
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users created`);
  return createdUsers;
};

// 创建活动类型
const createActivityTypes = async () => {
  const types = [
    { name: 'Academic Lecture', description: 'Lectures on academic topics' },
    { name: 'Workshop', description: 'Hands-on learning sessions' },
    { name: 'Sports Event', description: 'Various sports competitions' },
    { name: 'Cultural Festival', description: 'Cultural celebrations' }
  ];

  const createdTypes = await ActivityType.insertMany(types);
  console.log(`${createdTypes.length} activity types created`);
  return createdTypes;
};

// 创建活动
const createActivities = async (users, types) => {
  const admin = users.find(u => u.role === 'admin');
  const teacher = users.find(u => u.role === 'teacher');

  const activities = [
    {
      title: 'Annual Sports Day',
      description: 'School wide sports competition',
      activityType: types.find(t => t.name === 'Sports Event')._id,
      location: 'School Ground',
      startTime: new Date('2023-10-15T09:00:00'),
      endTime: new Date('2023-10-15T17:00:00'),
      organizer: admin._id,
      maxParticipants: 200,
      status: 'approved'
    },
    {
      title: 'Web Development Workshop',
      description: 'Learn modern web development techniques',
      activityType: types.find(t => t.name === 'Workshop')._id,
      location: 'Computer Lab 3',
      startTime: new Date('2023-10-20T13:00:00'),
      endTime: new Date('2023-10-20T16:00:00'),
      organizer: teacher._id,
      maxParticipants: 30,
      status: 'approved'
    },
    {
      title: 'AI in Education Seminar',
      description: 'Exploring AI applications in education',
      activityType: types.find(t => t.name === 'Academic Lecture')._id,
      location: 'Auditorium',
      startTime: new Date('2023-11-05T10:00:00'),
      endTime: new Date('2023-11-05T12:00:00'),
      organizer: teacher._id,
      maxParticipants: 100,
      status: 'pending'
    }
  ];

  const createdActivities = await Activity.insertMany(activities);
  console.log(`${createdActivities.length} activities created`);
  return createdActivities;
};

// 主函数
const seed = async () => {
  try {
    await clearData();
    const users = await createUsers();
    const types = await createActivityTypes();
    await createActivities(users, types);
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();