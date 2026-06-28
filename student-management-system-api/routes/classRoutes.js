const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
// 添加班级
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).send(newClass);
  } catch (error) {
    res.status(400).send(error);
  }
});
// 查询所有班级
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.send(classes);
  } catch (error) {
    res.status(500).send(error);
  }
});
// 根据 ID 查询班级
router.get('/:id', async (req, res) => {
  try {
    const classInfo = await Class.findById(req.params.id);
    if (!classInfo) {
      return res.status(404).send('班级未找到');
    }
    res.send(classInfo);
  } catch (error) {
    res.status(500).send(error);
  }
});
// 更新班级信息
router.put('/:id', async (req, res) => {
  try {
    const classInfo = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 返回更新后的文档
      runValidators: true, // 更新时验证数据
    });
    if (!classInfo) {
      return res.status(404).send('班级未找到');
    }
    res.send(classInfo);
  } catch (error) {
    res.status(400).send(error);
  }
});
// 删除班级
router.delete('/:id', async (req, res) => {
  try {
    const classInfo = await Class.findByIdAndDelete(req.params.id);
    if (!classInfo) {
      return res.status(404).send('班级未找到');
    }
    res.send(classInfo);
  } catch (error) {
    res.status(500).send(error);
  }
});
// 统计班级人数
router.get('/stats/count', async (req, res) => {
  try {
    const count = await Class.countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;