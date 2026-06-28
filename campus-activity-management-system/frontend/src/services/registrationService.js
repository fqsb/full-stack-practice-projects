import registrationsData from '../data/registrations.json';

export const getRegistrations = async () => {
  // 模拟异步请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(registrationsData);
    }, 500);
  });
};