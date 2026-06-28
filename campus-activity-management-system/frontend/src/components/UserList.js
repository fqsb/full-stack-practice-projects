import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import request from '../api/request';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await request.get('/admin/users');
      // 处理后端返回的数据结构
      const usersData = response.data?.users || response.data || [];
      // 确保每个用户对象都有必要的属性
      const formattedUsers = usersData.map(user => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: {
          name: user.profile?.name || '',
          studentId: user.profile?.studentId || '',
          department: user.profile?.department || '',
          grade: user.profile?.grade || ''
        }
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      name: user.profile?.name,
      studentId: user.profile?.studentId,
      department: user.profile?.department,
      grade: user.profile?.grade,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    if (!currentUser) return;
    
    try {
      const requestBody = {
        email: values.email,
        profile: {
          name: values.name,
          studentId: values.studentId,
          department: values.department,
          grade: values.grade
        }
      };

      const response = await request.patch(`/admin/users/${currentUser._id}`, requestBody);
      
      // 更新本地数据
      setUsers(users.map(user => 
        user._id === currentUser._id ? response.data : user
      ));
      
      setIsModalVisible(false);
      message.success('更新成功');
    } catch (error) {
      console.error('更新失败:', error);
      message.error(error.response?.data?.message || '更新失败');
    }
  };

  const handleDelete = async (user) => {
    console.log('handleDelete called with user:', user);
    try {
      await request.delete(`/admin/users/${user._id}`);
      message.success('删除成功');
      // 从本地数据中过滤掉被删除的用户
      setUsers(prevUsers => prevUsers.filter(item => item._id !== user._id));
    } catch (error) {
      console.error('删除失败:', error);
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '姓名',
      dataIndex: ['profile', 'name'],
      key: 'name',
    },
    {
      title: '学号',
      dataIndex: ['profile', 'studentId'],
      key: 'studentId',
    },
    {
      title: '院系',
      dataIndex: ['profile', 'department'],
      key: 'department',
    },
    {
      title: '年级',
      dataIndex: ['profile', 'grade'],
      key: 'grade',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除用户 ${record.username} 吗？`}
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button 
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table 
        columns={columns} 
        dataSource={users} 
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="编辑用户信息"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="username" label="用户名">
            <Input disabled />
          </Form.Item>
          <Form.Item 
            name="email" 
            label="邮箱" 
            rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="name" 
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
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

export default UserList;