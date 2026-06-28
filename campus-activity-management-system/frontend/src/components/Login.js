import React, { useState, useEffect } from 'react';
import request from '../api/request';
import { Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AlertModal = ({ visible, title, message: msg, onConfirm }) => (
  <Modal
    visible={visible}
    title={title}
    onOk={onConfirm}
    onCancel={onConfirm}
    centered
    closable={false}
    okText="确定"
    cancelButtonProps={{ style: { display: 'none' } }}
  >
    <p>{msg}</p>
  </Modal>
);

const Login = () => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();

  // 检查 token 是否存在
  useEffect(() => {
    const storedToken = localStorage.getItem('Logintoken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await request.post('/auth/login', {
        username,
        password,
      });
      
      // 处理新的响应格式
      // 响应拦截器已经将 response.data 设为 data 字段的内容
      // 但登录接口的data中包含user和token，需要特殊处理
      const { user, token } = response.data;
      
      if (user && token) {
        localStorage.setItem('Logintoken', token);
        localStorage.setItem('UserInfo', JSON.stringify(user));

        // 解析token获取用户角色
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('UserRole', decodedToken.role);

        setAlertVisible(true);
      } else {
        message.error("登录失败！请检查用户名和密码是否正确！");
      }
    } catch (error) {
      // 响应拦截器已经处理了错误消息的显示
      console.error('登录失败:', error);
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    setToken(localStorage.getItem('Logintoken'));
    navigate('/'); // 登录成功后跳转
  };

  const handleLogout = () => {
    localStorage.removeItem('Logintoken');
    setToken(null);
    message.success('您已退出登录');
  };

  // 已登录显示已登录页面
  if (token) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>您已登录</h2>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </div>
    );
  }

  // 未登录显示登录表单
  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: 400, margin: '0 auto', marginTop: 40 }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>

      <AlertModal
        visible={alertVisible}
        title="登录成功"
        message="您已成功登录，即将进入用户列表。"
        onConfirm={handleAlertConfirm}
      />
    </>
  );
};

export default Login;
