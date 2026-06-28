const Notification = require('../models/Notification');
const User = require('../models/User');
const messages = require('./response');

const createNotification = async (req, res) => {
  try {
    const { title, content, recipients, isBroadcast } = req.body;
    
    let notification;
    
    if (isBroadcast) {
      // 广播通知给所有用户
      notification = new Notification({
        title,
        content,
        sender: req.user._id,
        isBroadcast: true
      });
    } else {
      // 发送给特定用户
      notification = new Notification({
        title,
        content,
        sender: req.user._id,
        recipients,
        isBroadcast: false
      });
    }
    
    await notification.save();
    res.status(201).json({ message: messages.notification.success.create, data: notification });
  } catch (error) {
    res.status(400).json({ message: messages.notification.error.create, error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { isRead, isBroadcast, senderId } = req.query;
    const query = {};
    
    if (isRead !== undefined) {
      if (isRead === 'true') {
        query.readBy = req.user._id;
      } else {
        query.readBy = { $ne: req.user._id };
      }
    }
    
    if (isBroadcast !== undefined) {
      query.isBroadcast = isBroadcast === 'true';
    }
    
    if (senderId) {
      query.sender = senderId;
    }
    
    // 获取用户的通知：广播通知或直接发送给用户的
    const notifications = await Notification.find({
      $or: [
        { isBroadcast: true },
        { recipients: req.user._id }
      ],
      ...query
    })
    .populate('sender', 'username')
    .sort({ createdAt: -1 });
    
    res.json({ message: messages.notification.success.get, data: notifications });
  } catch (error) {
    res.status(500).json({ message: messages.notification.error.get, error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: messages.notification.error.notFound });
    }
    
    // 检查用户是否有权限标记为已读
    if (!notification.isBroadcast && !notification.recipients.includes(req.user._id)) {
      return res.status(403).json({ message: messages.notification.error.markAsRead, error: '没有权限标记此通知为已读' });
    }
    
    // 如果已经标记为已读，不做任何操作
    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }
    
    res.json({ message: messages.notification.success.markAsRead, data: notification });
  } catch (error) {
    res.status(400).json({ message: messages.notification.error.markAsRead, error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: messages.notification.error.notFound });
    }
    
    // 检查是否有权限删除
    if (notification.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: messages.notification.error.delete, error: '没有权限删除此通知' });
    }
    
    await notification.remove();
    res.json({ message: messages.notification.success.delete });
  } catch (error) {
    res.status(500).json({ message: messages.notification.error.delete, error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
};