const User = require('../models/User');
const Activity = require('../models/Activity');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const messages = require('./response');

// 获取所有用户
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (role) query.role = role;
    
    const users = await User.find(query)
      .select('-password -tokens')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const count = await User.countDocuments(query);
    
    res.json({
      message: messages.admin.success.getUsers,
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ message: messages.admin.error.getUsers, error: error.message });
  }
};

// 获取单个用户
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -tokens');
    
    if (!user) {
      return res.status(404).json({ message: messages.admin.error.userNotFound });
    }
    
    res.json({ message: messages.admin.success.getUsers, data: user });
  } catch (error) {
    res.status(500).json({ message: messages.admin.error.getUsers, error: error.message });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'role', 'profile'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: messages.auth.error.invalidUpdates });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: messages.admin.error.userNotFound });
    }
    
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    
    res.json({ message: messages.admin.success.updateUser, data: user });
  } catch (error) {
    res.status(400).json({ message: messages.admin.error.updateUser, error: error.message });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: messages.admin.error.userNotFound });
    }
    
    res.json({ message: messages.admin.success.deleteUser });
  } catch (error) {
    res.status(500).json({ message: messages.admin.error.deleteUser, error: error.message });
  }
};

// 获取所有活动（管理员视图）
const getAllActivities = async (req, res) => {
  try {
    const { status, organizer, activityType, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (organizer) query.organizer = organizer;
    if (activityType) query.activityType = activityType;
    
    const activities = await Activity.find(query)
      .populate('organizer', 'username profile')
      .populate('activityType', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
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

// 批量审批活动
const batchApproveActivities = async (req, res) => {
  try {
    const { activityIds, status, feedback } = req.body;
    
    if (!activityIds || !activityIds.length) {
      return res.status(400).json({ message: messages.approval.error.approve, error: '未选择活动' });
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: messages.approval.error.approve, error: '状态无效' });
    }
    
    // 更新活动状态
    const updateResult = await Activity.updateMany(
      { _id: { $in: activityIds }, status: 'pending' },
      { $set: { status } }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(400).json({ message: messages.approval.error.approve, error: '未找到待审批活动' });
    }
    
    // 创建审批记录
    const approvals = activityIds.map(activityId => ({
      activity: activityId,
      approver: req.user._id,
      status,
      feedback,
      approvalTime: new Date()
    }));
    
    await Approval.insertMany(approvals);
    
    // 获取审批后的活动信息
    const activities = await Activity.find({ _id: { $in: activityIds } })
      .populate('organizer', 'username email');
    
    // 发送通知给活动组织者
    const notifications = activities.map(activity => ({
      title: `Activity ${status}`,
      content: `Your activity "${activity.title}" has been ${status}. ${feedback || ''}`,
      sender: req.user._id,
      recipients: [activity.organizer._id],
      isBroadcast: false,
      createdAt: new Date()
    }));
    
    await Notification.insertMany(notifications);
    
    res.json({
      message: status === 'approved' ? messages.approval.success.approve : messages.approval.success.reject,
      data: {
        modifiedCount: updateResult.modifiedCount
      }
    });
  } catch (error) {
    res.status(400).json({ message: messages.approval.error.approve, error: error.message });
  }
};

// 获取系统统计数据
const getSystemStats = async (req, res) => {
  try {
    // 并行获取所有统计数据
    const [
      userCount,
      studentCount,
      teacherCount,
      adminCount,
      activityCount,
      pendingActivities,
      approvedActivities,
      activeRegistrations
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'admin' }),
      Activity.countDocuments(),
      Activity.countDocuments({ status: 'pending' }),
      Activity.countDocuments({ status: 'approved' }),
      Registration.countDocuments({ status: 'confirmed' })
    ]);
    
    res.json({
      message: messages.admin.success.getDashboardData,
      data: {
        userStats: {
          total: userCount,
          students: studentCount,
          teachers: teacherCount,
          admins: adminCount
        },
        activityStats: {
          total: activityCount,
          pending: pendingActivities,
          approved: approvedActivities
        },
        registrationStats: {
          active: activeRegistrations
        },
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: messages.admin.error.getDashboardData, error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllActivities,
  batchApproveActivities,
  getSystemStats
};