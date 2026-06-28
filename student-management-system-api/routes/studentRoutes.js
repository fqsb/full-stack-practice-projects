const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
// 添加学生
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});
// 查询所有学生
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('class');
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});
// 根据 ID 查询学生
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class');
    if (!student) {
      return res.status(404).send('学生未找到');
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});
// 更新学生信息
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) {
      return res.status(404).send('学生未找到');
    }
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});
// 删除学生
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send('学生未找到');
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});
// 统计学生人数
router.get('/stats/count', async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(500).send(error);
  }
});
// 按性别统计学生人数
router.get('/stats/gender', async (req, res) => {
  try {
    const genderStats = await Student.aggregate([
      {
        $group: {
          _id: "$gender", // 按 gender 字段分组
          count: { $sum: 1 }, // 统计每组数量
        },
      },
    ]);
    res.send(genderStats);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;