import React, { useState, useEffect } from 'react';
import request from '../api/request';  // 修改：使用request.js导出的axios实例
import { Form, Input, Button, message, Modal, Select } from 'antd';
import { UserAddOutlined, LockOutlined, LogoutOutlined, IdcardOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

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

const Register = () => {
  const [token, setToken] = useState(null);
  const [form] = Form.useForm();
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('Logintoken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (values) => {
    try {
      // 构造符合后端API要求的请求体
      const requestBody = {
        username: values.username,
        password: values.password,
        email: values.email,
        role: values.role,
        profile: {
          name: values.name,
          studentId: values.studentId,
          department: values.department
        }
      };

      // 调用后端注册API
      const response = await request.post('/auth/register', requestBody);
      
      if (response.data) {
        setAlertVisible(true);
        message.success('注册成功');
      } else {
        throw new Error(response.data.message || '注册失败');
      }
    } catch (error) {
      message.error(error.message || '注册失败，请重试');
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('Logintoken');
    setToken(null);
    message.success('您已退出登录');
  };

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

  return (
    <>
      <Form
        form={form}
        name="register_form"
        className="register-form"
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: 500, margin: '0 auto', marginTop: 40 }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input
            prefix={<UserAddOutlined />}
            placeholder="用户名"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱！', type: 'email' }]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="邮箱"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: '请选择角色！' }]}
        >
          <Select placeholder="请选择角色">
            <Option value="student">学生</Option>
            <Option value="teacher">教师</Option>
            <Option value="admin">管理员</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="真实姓名"
          rules={[{ required: true, message: '请输入真实姓名！' }]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="真实姓名"
          />
        </Form.Item>

        <Form.Item
          name="studentId"
          label="学号"
          rules={[{ required: true, message: '请输入学号！' }]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="学号"
          />
        </Form.Item>

        <Form.Item
          name="department"
          label="院系"
          rules={[{ required: true, message: '请输入所属院系！' }]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="所属院系"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            注册
          </Button>
        </Form.Item>
      </Form>

      <AlertModal
        visible={alertVisible}
        title="注册成功"
        message="欢迎加入！即将进入登录界面。"
        onConfirm={handleAlertConfirm}
      />
    </>
  );
};

export default Register;
