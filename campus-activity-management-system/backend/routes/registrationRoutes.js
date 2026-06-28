const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { auth, grantAccess } = require('../middleware/auth');

// 报名活动
router.post('/:activityId', auth, grantAccess('createOwn', 'registration'), registrationController.registerForActivity);

// 获取报名记录
router.get('/', auth, grantAccess('readOwn', 'registration'), registrationController.getRegistrations);

// 更新报名状态
router.patch('/:id/status', auth, registrationController.updateRegistrationStatus);

// 删除报名记录
router.delete('/:id', auth, registrationController.deleteRegistration);

module.exports = router;