import React, { useState, useEffect } from 'react';
import request from '../api/request';
import { Card, Descriptions, Button, Modal, Form, Input,message } from 'antd';
import { UserOutlined, IdcardOutlined, MailOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await request.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      ...user.profile
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      // 构造符合后端API要求的请求体
      const requestBody = {
        email: values.email,
        profile: {
          name: values.name,
          studentId: values.studentId,
          department: values.department,
          grade: values.grade
        }
      };
      
      // 使用PATCH方法更新用户信息
      const response = await request.patch('/auth/me', requestBody);
      setUser(response.data);
      setIsModalVisible(false);
      message.success('更新成功');
    } catch (error) {
      console.error('更新失败:', error);
      message.error(error.response?.data?.message || '更新失败');
    }
  };

  const profile = user.profile || {};

  if (loading) {
    return <Card title="个人信息" style={{ margin: 16 }}>加载中...</Card>;
  }

  return (
    <>
      <Card 
        title="个人信息" 
        style={{ margin: 16 }}
        extra={<Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="姓名" labelStyle={{ width: 100 }}>
            <UserOutlined /> {profile.name || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="学号">
            <IdcardOutlined /> {profile.studentId || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="院系">
            <IdcardOutlined /> {profile.department || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="年级">
            <IdcardOutlined /> {profile.grade || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="用户名">
            <UserOutlined /> {user.username || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <MailOutlined /> {user.email || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            <ClockCircleOutlined /> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="最后更新时间">
            <ClockCircleOutlined /> {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '未设置'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="编辑个人信息"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="username" label="用户名">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="studentId" label="学号">
            <Input />
          </Form.Item>
          <Form.Item name="department" label="院系">
            <Input />
          </Form.Item>
          <Form.Item name="grade" label="年级">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserProfile;