const Activity = require('../models/Activity');
const ActivityType = require('../models/ActivityType');
const Registration = require('../models/Registration');
const Approval = require('../models/Approval');
const messages = require('./response');

const createActivity = async (req, res) => {
  try {
    const activity = new Activity({
      ...req.body,
      organizer: req.user._id
    });
    
    await activity.save();
    
    // 如果是老师创建的，需要管理员审批
    if (req.user.role === 'teacher') {
      activity.status = 'pending';
      await activity.save();
    }
    
    res.status(201).json({ message: messages.activity.success.create, data: activity });
  } catch (error) {
    res.status(400).json({ message: messages.activity.error.create, error: error.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const { status, activityType, organizer, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (activityType) query.activityType = activityType;
    if (organizer) query.organizer = organizer;
    
    // 学生只能看到已批准的活动
    if (req.user.role === 'student') {
      query.status = 'approved';
    }
    
    const activities = await Activity.find(query)
      .populate('organizer', 'username profile')
      .populate('activityType', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ startTime: -1 });
    
    const count = await Activity.countDocuments(query);
    
    res.json({
      message: messages.activity.success.get,
      data: {
        activities,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ message: messages.activity.error.get, error: error.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('organizer', 'username profile')
      .populate('activityType', 'name');
    
    if (!activity) {
      return res.status(404).json({ message: messages.activity.error.notFound });
    }
    
    res.json({ message: messages.activity.success.getById, data: activity });
  } catch (error) {
    res.status(500).json({ message: messages.activity.error.getById, error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: messages.activity.error.notFound });
    }
    
    // 检查是否有权限更新
    if (activity.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: messages.activity.error.notAuthorized });
    }
    
    const updates = Object.keys(req.body);
    updates.forEach(update => activity[update] = req.body[update]);
    
    // 如果活动被更新，状态重置为待审核（如果是老师更新的）
    if (req.user.role === 'teacher') {
      activity.status = 'pending';
    }
    
    await activity.save();
    res.json({ message: messages.activity.success.update, data: activity });
  } catch (error) {
    res.status(400).json({ message: messages.activity.error.update, error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: messages.activity.error.notFound });
    }
    
    // 检查是否有权限删除
    if (activity.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: messages.activity.error.notAuthorized });
    }
    
    // 使用deleteOne()替代remove()
    await Activity.deleteOne({ _id: req.params.id });
    
    // 同时删除相关的报名记录
    await Activity.findByIdAndDelete(req.params.id);
    
    res.json({ message: messages.activity.success.delete });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: messages.activity.error.delete, error: error.message });
  }
};
const getActivityTypes = async (req, res) => {
  try {
    const activityTypes = await ActivityType.find();
    res.json({ message: messages.activityType.success.get, data: activityTypes });
  } catch (error) {
    res.status(500).json({ message: messages.activityType.error.get, error: error.message });
  }
};

const createActivityType = async (req, res) => {
  try {
    const activityType = new ActivityType(req.body);
    await activityType.save();
    res.status(201).json({ message: messages.activityType.success.create, data: activityType });
  } catch (error) {
    res.status(400).json({ message: messages.activityType.error.create, error: error.message });
  }
};

const updateActivityType = async (req, res) => {
  try {
    const activityType = await ActivityType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activityType) {
      return res.status(404).json({ message: messages.activityType.error.notFound });
    }
    res.json({ message: messages.activityType.success.update, data: activityType });
  } catch (error) {
    res.status(400).json({ message: messages.activityType.error.update, error: error.message });
  }
};

const deleteActivityType = async (req, res) => {
  try {
    const activityType = await ActivityType.findByIdAndDelete(req.params.id);
    if (!activityType) {
      return res.status(404).json({ message: messages.activityType.error.notFound });
    }
    res.json({ message: messages.activityType.success.delete });
  } catch (error) {
    res.status(500).json({ message: messages.activityType.error.delete, error: error.message });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivityTypes,
  createActivityType,
  updateActivityType,
  deleteActivityType
};