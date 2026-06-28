const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { auth, grantAccess } = require('../middleware/auth');

// 获取所有活动（用于审核页面）
router.get('/activities', auth, grantAccess('readAny', 'approval'), approvalController.getActivitiesForApproval);

// 获取审批记录
router.get('/', auth, grantAccess('readAny', 'approval'), approvalController.getApprovals);

// 审批单个活动
router.post('/:id', auth, grantAccess('updateAny', 'approval'), approvalController.approveActivity);

// 批量审批活动
router.post('/batch', auth, grantAccess('updateAny', 'approval'), approvalController.batchApproveActivities);

module.exports = router;