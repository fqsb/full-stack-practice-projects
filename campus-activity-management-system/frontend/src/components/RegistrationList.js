import React, { useEffect, useState } from 'react';
import { Table, Tag, Space } from 'antd';
import { getRegistrations } from '../services/registrationService';

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: '活动ID',
      dataIndex: 'activity_id',
      key: 'activity_id',
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'default';
        if (status === 'confirmed') color = 'green';
        if (status === 'rejected') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: '报名时间',
      dataIndex: 'register_time',
      key: 'register_time',
      render: time => new Date(time).toLocaleString(),
    },
    {
      title: '确认时间',
      dataIndex: 'confirm_time',
      key: 'confirm_time',
      render: time => time ? new Date(time).toLocaleString() : '未确认',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>查看详情</a>
          <a>编辑</a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, minHeight: '100%' }}>
      <h1>报名列表</h1>
      <Table 
        columns={columns} 
        dataSource={registrations} 
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
};

export default RegistrationList;