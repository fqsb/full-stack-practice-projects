// 标准响应消息模板
const messages = {
  activity: {
    success: {
      create: '活动创建成功',
      get: '活动获取成功',
      getById: '活动详情获取成功',
      update: '活动更新成功',
      delete: '活动删除成功'
    },
    error: {
      create: '活动创建失败',
      get: '活动获取失败',
      getById: '活动详情获取失败',
      update: '活动更新失败',
      delete: '活动删除失败',
      notFound: '未找到该活动',
      notAuthorized: '没有权限操作此活动'
    }
  },
  activityType: {
    success: {
      get: '活动类型获取成功',
      create: '活动类型创建成功',
      update: '活动类型更新成功',
      delete: '活动类型删除成功'
    },
    error: {
      get: '活动类型获取失败',
      create: '活动类型创建失败',
      update: '活动类型更新失败',
      delete: '活动类型删除失败',
      notFound: '未找到该活动类型'
    }
  },
  auth: {
    success: {
      register: '用户注册成功',
      login: '登录成功',
      getProfile: '个人信息获取成功',
      updateProfile: '个人信息更新成功'
    },
    error: {
      register: '用户注册失败',
      login: '登录失败',
      getProfile: '个人信息获取失败',
      updateProfile: '个人信息更新失败',
      invalidCredentials: '用户名或密码错误',
      existingUser: '用户名或邮箱已存在',
      notAuthenticated: '用户未认证',
      invalidUpdates: '无效的更新字段'
    }
  },
  notification: {
    success: {
      create: '通知创建成功',
      get: '通知获取成功',
      getById: '通知详情获取成功',
      update: '通知更新成功',
      delete: '通知删除成功',
      markAsRead: '通知已标记为已读'
    },
    error: {
      create: '通知创建失败',
      get: '通知获取失败',
      getById: '通知详情获取失败',
      update: '通知更新失败',
      delete: '通知删除失败',
      markAsRead: '标记通知失败',
      notFound: '未找到该通知'
    }
  },
  admin: {
    success: {
      getUsers: '用户列表获取成功',
      updateUser: '用户信息更新成功',
      deleteUser: '用户删除成功',
      createActivityType: '活动类型创建成功',
      getDashboardData: '仪表盘数据获取成功'
    },
    error: {
      getUsers: '用户列表获取失败',
      updateUser: '用户信息更新失败',
      deleteUser: '用户删除失败',
      createActivityType: '活动类型创建失败',
      getDashboardData: '仪表盘数据获取失败',
      userNotFound: '未找到该用户'
    }
  },
  approval: {
    success: {
      approve: '活动审批通过',
      reject: '活动审批拒绝',
      getPending: '待审批活动获取成功',
      getById: '审批详情获取成功'
    },
    error: {
      approve: '活动审批失败',
      reject: '活动审批拒绝失败',
      getPending: '待审批活动获取失败',
      getById: '审批详情获取失败',
      notFound: '未找到该审批记录',
      activityNotFound: '未找到该活动'
    }
  },
  registration: {
    success: {
      create: '活动报名成功',
      get: '报名记录获取成功',
      getById: '报名详情获取成功',
      update: '报名信息更新成功',
      delete: '报名取消成功',
      getMy: '我的报名记录获取成功',
      getActivityRegistrations: '活动报名列表获取成功'
    },
    error: {
      create: '活动报名失败',
      get: '报名记录获取失败',
      getById: '报名详情获取失败',
      update: '报名信息更新失败',
      delete: '报名取消失败',
      getMy: '我的报名记录获取失败',
      getActivityRegistrations: '活动报名列表获取失败',
      notFound: '未找到该报名记录',
      activityNotFound: '未找到该活动',
      alreadyRegistered: '已经报名该活动',
      activityClosed: '活动已关闭报名',
      capacityFull: '活动名额已满'
    }
  }
};

module.exports = messages; 