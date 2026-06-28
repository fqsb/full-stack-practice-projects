const express = require('express');
const auth = require('../middleware/auth').auth;
const router = express.Router();

const authController = require('../controllers/authController');

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

// 登出
//router.post('/logout', authController.logout);


// 获取个人资料（需要认证）
router.get('/me', auth, authController.getProfile);

// 更新个人信息
router.patch('/me',auth, authController.updateProfile);

module.exports = router;