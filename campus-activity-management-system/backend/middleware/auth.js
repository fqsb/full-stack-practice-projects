const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { roles } = require('../config/roles');

const auth = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户（不验证token是否在数据库中，因为我们使用无状态JWT）
    const user = await User.findById(decoded._id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // 将用户和token附加到请求对象
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Please authenticate',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(403).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { auth, grantAccess };