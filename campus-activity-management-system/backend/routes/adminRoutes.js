const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, grantAccess } = require('../middleware/auth');

// 获取所有用户
router.get('/users', auth, grantAccess('readAny', 'user'), adminController.getAllUsers);

// 获取单个用户
router.get('/users/:id', auth, grantAccess('readAny', 'user'), adminController.getUserById);

// 更新用户
router.patch('/users/:id', auth, grantAccess('updateAny', 'user'), adminController.updateUser);

// 删除用户
router.delete('/users/:id', auth, grantAccess('deleteAny', 'user'), adminController.deleteUser);

// 获取所有活动（管理员视图）
router.get('/activities', auth, grantAccess('readAny', 'activity'), adminController.getAllActivities);

// 批量审批活动
router.post('/activities/batch-approve', auth, grantAccess('updateAny', 'activity'), adminController.batchApproveActivities);

// 获取系统统计数据
router.get('/stats', auth, grantAccess('readAny', 'stats'), adminController.getSystemStats);

module.exports = router;