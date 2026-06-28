const Registration = require('../models/Registration');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const messages = require('./response');

const registerForActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    
    if (!activity) {
      return res.status(404).json({ message: messages.registration.error.activityNotFound });
    }
    
    if (activity.status !== 'approved') {
      return res.status(400).json({ message: messages.registration.error.create, error: '活动未批准，无法报名' });
    }
    
    if (activity.currentParticipants >= activity.maxParticipants) {
      return res.status(400).json({ message: messages.registration.error.capacityFull });
    }
    
    // 检查是否已经报名
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      activity: req.params.activityId
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: messages.registration.error.alreadyRegistered });
    }
    
    const registration = new Registration({
      user: req.user._id,
      activity: req.params.activityId,
      additionalInfo: req.body.additionalInfo
    });
    
    await registration.save();
    
    // 如果是需要确认的活动，发送通知给组织者
    if (activity.needConfirmation) {
      const notification = new Notification({
        title: 'New Activity Registration',
        content: `${req.user.username} has registered for your activity "${activity.title}"`,
        sender: req.user._id,
        recipients: [activity.organizer],
        isBroadcast: false
      });
      
      await notification.save();
    }
    
    res.status(201).json({ message: messages.registration.success.create, data: registration });
  } catch (error) {
    res.status(400).json({ message: messages.registration.error.create, error: error.message });
  }
};

const getRegistrations = async (req, res) => {
  try {
    const { activityId, userId, status } = req.query;
    const query = {};
    
    if (activityId) query.activity = activityId;
    if (userId) query.user = userId;
    if (status) query.status = status;
    
    // 如果是普通用户，只能查看自己的报名记录
    if (req.user.role === 'student') {
      query.user = req.user._id;
    }
    
    // 如果是活动组织者，可以查看自己活动的报名记录
    if (req.user.role === 'teacher') {
      const activities = await Activity.find({ organizer: req.user._id });
      query.activity = { $in: activities.map(a => a._id) };
    }
    
    const registrations = await Registration.find(query)
      .populate('user', 'username profile')
      .populate('activity', 'title startTime endTime');
    
    res.json({ 
      message: req.user.role === 'student' ? messages.registration.success.getMy : messages.registration.success.get, 
      data: registrations 
    });
  } catch (error) {
    res.status(500).json({ message: messages.registration.error.get, error: error.message });
  }
};

const updateRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('activity', 'organizer maxParticipants currentParticipants title');
    
    if (!registration) {
      return res.status(404).json({ message: messages.registration.error.notFound });
    }
    
    // 检查是否有权限更新
    if (req.user.role === 'student' && registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: messages.registration.error.update, error: '没有权限更新此报名记录' });
    }
    
    // 如果是活动组织者或管理员，可以更新状态
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      if (registration.activity.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: messages.registration.error.update, error: '没有权限更新此报名记录' });
      }
      
      const { status } = req.body;
      registration.status = status;
      
      // 如果状态变为confirmed，增加活动参与人数
      if (status === 'confirmed' && registration.status !== 'confirmed') {
        if (registration.activity.currentParticipants >= registration.activity.maxParticipants) {
          return res.status(400).json({ message: messages.registration.error.capacityFull });
        }
        
        registration.activity.currentParticipants += 1;
        await registration.activity.save();
      }
      
      // 如果状态从confirmed变为其他，减少活动参与人数
      if (registration.status === 'confirmed' && status !== 'confirmed') {
        registration.activity.currentParticipants -= 1;
        await registration.activity.save();
      }
      
      await registration.save();
      
      // 发送通知给报名者
      const notification = new Notification({
        title: 'Registration Status Updated',
        content: `Your registration for activity "${registration.activity.title}" has been ${status}`,
        sender: req.user._id,
        recipients: [registration.user],
        isBroadcast: false
      });
      
      await notification.save();
      
      return res.json({ message: messages.registration.success.update, data: registration });
    }
    
    // 学生只能取消自己的报名
    if (req.body.status === 'rejected' && registration.status === 'pending') {
      registration.status = 'rejected';
      await registration.save();
      return res.json({ message: messages.registration.success.update, data: registration });
    }
    
    res.status(403).json({ message: messages.registration.error.update, error: '没有权限执行此操作' });
  } catch (error) {
    res.status(400).json({ message: messages.registration.error.update, error: error.message });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('activity', 'currentParticipants');
    
    if (!registration) {
      return res.status(404).json({ message: messages.registration.error.notFound });
    }
    
    // 检查是否有权限删除
    if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: messages.registration.error.delete, error: '没有权限删除此报名记录' });
    }
    
    // 如果已确认，减少活动参与人数
    if (registration.status === 'confirmed') {
      registration.activity.currentParticipants -= 1;
      await registration.activity.save();
    }
    
    await registration.remove();
    res.json({ message: messages.registration.success.delete });
  } catch (error) {
    res.status(500).json({ message: messages.registration.error.delete, error: error.message });
  }
};

module.exports = {
  registerForActivity,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration
};