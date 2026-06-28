const activities = [
    {
      id: 1,
      title: "校园歌唱比赛",
      description: "一年一度的校园歌唱比赛，展示你的音乐才华！",
      type: "文艺",
      startTime: "2025-04-15T14:00:00",
      endTime: "2024-04-15T17:00:00",
      location: "学校大礼堂",
      maxParticipants: 200,
      status: "已结束",
      imageUrl: "/image/c.jpg"
    },
    {
      id: 2,
      title: "编程马拉松",
      description: "24小时编程挑战，与团队一起创造令人惊叹的项目！",
      type: "学术",
      startTime: "2025-06-10T09:00:00",
      endTime: "2025-06-11T09:00:00",
      location: "计算机科学楼",
      maxParticipants: 50,
      status: "未开始",
      imageUrl: "/image/b.jpg"
    },
    {
      id: 3,
      title: "春季运动会",
      description: "展示体育精神的盛会，包括田径、球类等多种项目",
      type: "体育",
      startTime: "2025-04-20T08:00:00",
      endTime: "2025-04-22T18:00:00",
      location: "学校体育场",
      maxParticipants: 500,
      status: "已结束",
      imageUrl: "/image/a.jpg"
    },
    {
      id: 4,
      title: "职业规划讲座",
      description: "知名企业HR分享求职技巧和职业发展建议",
      type: "讲座",
      startTime: "2025-05-08T15:00:00",
      endTime: "2025-05-08T17:30:00",
      location: "报告厅A",
      maxParticipants: 150,
      status: "进行中",
      imageUrl: "/image/d.jpg"
    }
  ];
  let nextId = activities.length + 1;
  export const fetchActivities = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(activities);
      }, 500); // 模拟网络延迟
    });
  };
export const deleteActivity = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = activities.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};

export const updateActivity = (id, newData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = activities.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities[index] = { ...activities[index], ...newData, id };
      }
      resolve();
    }, 500);
  });
};

export const addActivity = (newActivity) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      activities.push({ ...newActivity, id: nextId++ });
      resolve();
    }, 500);
  });
};
// 模拟活动报名数据
const registrations = [];
let registrationId = 1;

// 提交报名信息
export const submitRegistration = (activityId, registrationData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRegistration = {
        id: registrationId++,
        activityId,
        ...registrationData,
        registrationTime: new Date().toISOString(),
        status: '已报名'
      };
      registrations.push(newRegistration);
      resolve(newRegistration);
    }, 1000);
  });
};

// 获取某个活动的所有报名记录
export const getRegistrationsByActivity = (activityId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = registrations.filter(reg => reg.activityId === activityId);
      resolve(result);
    }, 500);
  });
};

// 获取用户的所有报名记录
export const getRegistrationsByUser = (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = registrations.filter(reg => reg.email === email);
      resolve(result);
    }, 500);
  });
};

// 取消报名
export const cancelRegistration = (registrationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = registrations.findIndex(reg => reg.id === registrationId);
      if (index !== -1) {
        registrations[index].status = '已取消';
      }
      resolve({ success: true });
    }, 500);
  });
};