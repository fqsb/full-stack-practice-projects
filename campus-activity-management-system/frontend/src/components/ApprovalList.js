import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import request from '../api/request';
import ConfirmDialog from './ConfirmDialog';

const ApprovalList = () => {
  const [activities, setActivities] = useState([]);
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activitiesRes, approvalsRes] = await Promise.all([
        request.get('/approvals/activities'),
        request.get('/approvals')
      ]);
      
      setActivities(activitiesRes.data);
      setApprovalRecords(approvalsRes.data);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getApprovalForActivity = (activityId) => {
    return approvalRecords.find(record => 
      record.activity && 
      (typeof record.activity === 'string' ? 
       record.activity === activityId : 
       record.activity._id === activityId)
    );
  };

  const handleApprove = async (activity) => {
    try {
      await request.post(`/approvals/${activity._id}`, {
        status: 'approved',
        feedback: '通过'
      });
      message.success('审批已通过');
      await fetchData();
    } catch (error) {
      console.error('审批操作失败:', error);
      message.error('审批操作失败');
    }
  };

  const showRejectConfirm = (activity) => {
    setCurrentActivity(activity);
    setRejectDialogVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!currentActivity) return;
    
    setConfirmLoading(true);
    try {
      await request.post(`/approvals/${currentActivity._id}`, {
        status: 'rejected',
        feedback: '拒绝'
      });
      message.success('已拒绝');
      setRejectDialogVisible(false);
      await fetchData();
    } catch (error) {
      console.error('拒绝操作失败:', error);
      message.error('拒绝操作失败');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogVisible(false);
  };

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color, icon;
        switch (status) {
          case 'approved':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'rejected':
            color = 'red';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'orange';
            icon = <ExclamationCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: '审批时间',
      key: 'approvalTime',
      render: (_, activity) => {
        const approval = getApprovalForActivity(activity._id);
        return approval?.approvalTime 
          ? new Date(approval.approvalTime).toLocaleString() 
          : '未审批';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, activity) => {
        const approval = getApprovalForActivity(activity._id);
        const isPending = activity.status === 'pending' && !approval;
        
        return (
          <Space>
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleApprove(activity)}
              disabled={!isPending}
            >
              通过
            </Button>
            <Button 
              danger 
              icon={<CloseCircleOutlined />}
              onClick={() => showRejectConfirm(activity)}
              disabled={!isPending}
            >
              拒绝
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>活动审批列表</h1>
      <Table 
        columns={columns} 
        dataSource={activities} 
        loading={loading}
        rowKey="_id"
        bordered
      />
      <ConfirmDialog
        title="确认拒绝"
        content="确定要拒绝此活动吗？"
        visible={rejectDialogVisible}
        confirmLoading={confirmLoading}
        onConfirm={handleRejectConfirm}
        onCancel={handleRejectCancel}
      />
    </div>
  );
};

export default ApprovalList;