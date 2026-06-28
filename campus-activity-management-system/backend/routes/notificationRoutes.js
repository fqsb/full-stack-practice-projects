const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, grantAccess } = require('../middleware/auth');

// 创建通知
router.post('/', auth, grantAccess('createAny', 'notification'), notificationController.createNotification);

// 获取通知
router.get('/', auth, notificationController.getNotifications);

// 标记通知为已读
router.patch('/:id/read', auth, notificationController.markAsRead);

// 删除通知
router.delete('/:id', auth, grantAccess('deleteAny', 'notification'), notificationController.deleteNotification);

module.exports = router;