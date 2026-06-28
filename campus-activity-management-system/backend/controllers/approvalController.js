const Approval = require('../models/Approval');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const messages = require('./response');

// 获取审批记录
const getApprovals = async (req, res) => {
  try {
    const { status, activityId, approverId } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (activityId) query.activity = activityId;
    if (approverId) query.approver = approverId;
    
    const approvals = await Approval.find(query)
      .populate('activity', 'title organizer status')
      .populate('approver', 'username')
      .sort({ approvalTime: -1 }); // 按审核时间倒序
    
    res.json({ message: messages.approval.success.getPending, data: approvals });
  } catch (error) {
    res.status(500).json({ message: messages.approval.error.getPending, error: error.message });
  }
};

// 获取所有活动（用于审核页面）
const getActivitiesForApproval = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status) query.status = status;
    
    const activities = await Activity.find(query)
      .populate('organizer', 'username')
      .sort({ createdAt: -1 });
    
    res.json({ message: messages.approval.success.getPending, data: activities });
  } catch (error) {
    res.status(500).json({ message: messages.approval.error.getPending, error: error.message });
  }
};

// 审批单个活动
const approveActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: messages.approval.error.activityNotFound });
    }
    
    if (activity.status !== 'pending') {
      return res.status(400).json({ message: messages.approval.error.approve, error: '活动不在待审批状态' });
    }
    
    const { status, feedback } = req.body;
    const approvalTime = new Date();
    
    // 更新活动状态
    activity.status = status;
    await activity.save();
    
    // 创建审批记录
    const approval = new Approval({
      activity: activity._id,
      approver: req.user._id,
      status,
      feedback,
      approvalTime
    });
    
    await approval.save();
    
    // 发送通知
    const notification = new Notification({
      title: 'Activity Approval Result',
      content: `Your activity "${activity.title}" has been ${status} at ${approvalTime.toLocaleString()}. Feedback: ${feedback || 'No feedback provided'}`,
      sender: req.user._id,
      recipients: [activity.organizer],
      isBroadcast: false
    });
    
    await notification.save();
    
    res.json({
      message: status === 'approved' ? messages.approval.success.approve : messages.approval.success.reject,
      data: {
        ...approval.toObject(),
        activity: {
          _id: activity._id,
          title: activity.title,
          status: activity.status
        },
        approver: {
          _id: req.user._id,
          username: req.user.username
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: messages.approval.error.approve, error: error.message });
  }
};

// 批量审批活动
const batchApproveActivities = async (req, res) => {
  try {
    const { activityIds, status, feedback } = req.body;
    
    if (!activityIds || !activityIds.length) {
      return res.status(400).json({ message: messages.approval.error.approve, error: '未选择活动' });
    }
    
    const activities = await Activity.find({ 
      _id: { $in: activityIds },
      status: 'pending'
    });
    
    if (!activities.length) {
      return res.status(400).json({ message: messages.approval.error.approve, error: '未找到待审批活动' });
    }
    
    const approvalTime = new Date();
    
    // 批量更新活动状态
    await Activity.updateMany(
      { _id: { $in: activities.map(a => a._id) } },
      { $set: { status } }
    );
    
    // 创建审批记录
    const approvals = activities.map(activity => ({
      activity: activity._id,
      approver: req.user._id,
      status,
      feedback,
      approvalTime
    }));
    
    await Approval.insertMany(approvals);
    
    // 发送通知
    const notifications = activities.map(activity => ({
      title: 'Activity Approval Result',
      content: `Your activity "${activity.title}" has been ${status} at ${approvalTime.toLocaleString()}. Feedback: ${feedback || 'No feedback provided'}`,
      sender: req.user._id,
      recipients: [activity.organizer],
      isBroadcast: false,
      createdAt: new Date()
    }));
    
    await Notification.insertMany(notifications);
    
    res.json({ 
      message: status === 'approved' ? messages.approval.success.approve : messages.approval.success.reject,
      data: {
        count: activities.length,
        approvalTime
      }
    });
  } catch (error) {
    res.status(400).json({ message: messages.approval.error.approve, error: error.message });
  }
};

module.exports = {
  getApprovals,
  getActivitiesForApproval,
  approveActivity,
  batchApproveActivities
};