import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, DatePicker, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import request from '../api/request';  // 引入request.js导出的axios实例

const { Search } = Input;
const { RangePicker } = DatePicker;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await request.get('/activities/types/all');
        setCategories(response.data);
      } catch (error) {
        console.error('获取分类数据失败:', error);
        message.error('获取分类数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredCategories = categories.filter(category => 
    !searchText || 
    (category.name && category.name.toLowerCase().includes(searchText.toLowerCase())) || 
    (category.description && category.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleCreate = () => {
    setCurrentCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const response= await request.delete(`/activities/types/${record._id}`);
      if (response.data) {
        setCategories(prev => prev.filter(item => item._id !== record._id));
        message.success('删除成功');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentCategory) {
        // 编辑
        const response = await request.patch(`/activities/types/${currentCategory._id}`, values);
        setCategories(prev => prev.map(item => 
          item._id === currentCategory._id ? response.data : item
        ));
        message.success('编辑成功');
        setIsModalVisible(false);  // 添加这行，成功后关闭Modal
      } else {
        // 新建
        const response = await request.post('/activities/types', values);
        if (response.data) {
          setCategories(prev => [...prev, response.data]);
          message.success('新建成功');
          setIsModalVisible(false);
        } else {
          message.error('新建失败：返回数据格式错误');
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除分类 "${record.name}" 吗？`}
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Search
            placeholder="输入名称或描述搜索"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <RangePicker showTime />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建分类
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title={currentCategory ? '编辑分类' : '新建分类'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入分类描述' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;