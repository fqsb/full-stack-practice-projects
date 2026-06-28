const User = require('../models/User');
const jwt = require('jsonwebtoken');
const messages = require('./response');

const register = async (req, res) => {
  try {
    const { username, password, email, role, profile } = req.body;
    
    // 检查用户名和邮箱是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: messages.auth.error.existingUser, error: '用户名或邮箱已存在' });
    }

    const user = new User({
      username,
      password,
      email,
      role: role || 'student',
      profile
    });

    await user.save();
    
    // 生成JWT但不存储
    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回用户信息时排除密码
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ message: messages.auth.success.register, user: userResponse, token });
  } catch (error) {
    res.status(400).json({ message: messages.auth.error.register, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: messages.auth.error.invalidCredentials });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: messages.auth.error.invalidCredentials });
    }
    
    // 生成JWT
    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回用户信息时排除密码
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: messages.auth.success.login, user: userResponse, token });
  } catch (error) {
    res.status(400).json({ message: messages.auth.error.login, error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: messages.auth.error.notAuthenticated });
    }
    
    // 创建用户对象的纯JavaScript版本
    const user = req.user.toObject ? req.user.toObject() : { ...req.user };
    
    // 移除敏感信息
    delete user.password;
    delete user.tokens; // 如果存在
    
    res.json({ message: messages.auth.success.getProfile, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: messages.auth.error.getProfile, error: '获取个人信息失败' });
  }
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password', 'profile'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: messages.auth.error.invalidUpdates });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    
    // 返回更新后的用户信息（排除密码）
    const user = req.user.toObject();
    delete user.password;
    res.json({ message: messages.auth.success.updateProfile, data: user });
  } catch (error) {
    res.status(400).json({ message: messages.auth.error.updateProfile, error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};