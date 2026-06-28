const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { auth, grantAccess } = require('../middleware/auth');

// 创建活动
router.post('/', auth, grantAccess('createOwn', 'activity'), activityController.createActivity);

// 获取活动列表
router.get('/', auth, grantAccess('readAny', 'activity'), activityController.getActivities);

// 获取单个活动
router.get('/:id', auth, grantAccess('readAny', 'activity'), activityController.getActivityById);

// 更新活动
router.patch('/:id', auth, grantAccess('updateOwn', 'activity'), activityController.updateActivity);

// 删除活动
router.delete('/:id', auth, grantAccess('deleteOwn', 'activity'), activityController.deleteActivity);

// 活动类型相关路由
router.get('/types/all', auth, activityController.getActivityTypes);
router.post('/types', auth, grantAccess('createAny', 'activityType'), activityController.createActivityType);
router.patch('/types/:id', auth, grantAccess('updateAny', 'activityType'), activityController.updateActivityType);
router.delete('/types/:id', auth, grantAccess('deleteAny', 'activityType'), activityController.deleteActivityType);

module.exports = router;