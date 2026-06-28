import React, { useState, useEffect } from 'react';
import request from '../api/request';
import { 
  Card, 
  Col, 
  Row, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Select, 
  DatePicker,
  Modal,
  Form,
  message
} from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    title: '',
    status: '',
    dateRange: []
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [form] = Form.useForm();
  const [activityTypes, setActivityTypes] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 获取用户角色
    const token = localStorage.getItem('Logintoken');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role);
      } catch (error) {
        console.error('解析token失败:', error);
      }
    }
    
    loadActivities();
    loadActivityTypes();
  }, []);

  const loadActivityTypes = async () => {
    try {
      const response = await request.get('/activities/types/all');
      setActivityTypes(response.data);
    } catch (error) {
      console.error('获取活动分类失败:', error);
    }
  };

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await request.get('/activities');
      const activitiesData = response.data.activities.map(activity => {
        let status = activity.status;
        if(status === 'pending') status = '未开始';
        if(status === 'approved') status = '已开始';
        if(new Date(activity.endTime) < new Date()) status = '已结束';
        return {...activity, status};
      });
      setActivities(activitiesData);
      setFilteredActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterActivities();
  }, [searchParams, activities]);

  const filterActivities = () => {
    let result = [...activities];
    
    if (searchParams.title) {
      result = result.filter(activity => 
        activity.title.toLowerCase().includes(searchParams.title.toLowerCase())
      );
    }
    
    if (searchParams.status) {
      result = result.filter(activity => activity.status === searchParams.status);
    }
    
    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [start, end] = searchParams.dateRange;
      result = result.filter(activity => {
        const activityStart = new Date(activity.startTime);
        const activityEnd = new Date(activity.endTime);
        return activityStart >= start && activityEnd <= end;
      });
    }
    
    setFilteredActivities(result);
  };

  const getStatusTag = (status) => {
    let color = '';
    switch (status) {
      case '进行中': color = 'processing'; break;
      case '未开始': color = 'warning'; break;
      case '已结束': color = 'default'; break;
      default: color = 'success';
    }
    return <Tag color={color}>{status}</Tag>;
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD HH:mm');
  };

  const handleSearch = (value) => {
    setSearchParams({...searchParams, title: value});
  };

  const handleStatusChange = (value) => {
    setSearchParams({...searchParams, status: value});
  };

  const handleDateChange = (dates) => {
    setSearchParams({...searchParams, dateRange: dates});
  };

  const showEditModal = (activity = null) => {
    setCurrentActivity(activity);
    if (activity) {
      form.setFieldsValue({
        ...activity,
        timeRange: [
          moment(activity.startTime),
          moment(activity.endTime)
        ]
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/activities/${id}`);
      loadActivities();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('Logintoken');
      const user = JSON.parse(atob(token.split('.')[1]));
      
      const activityData = {
        title: values.title,
        description: values.description,
        activityType: values.type,
        location: values.location,
        startTime: values.timeRange[0].toISOString(),
        endTime: values.timeRange[1].toISOString(),
        maxParticipants: parseInt(values.maxParticipants),
        organizer: user._id
      };
      
      if (currentActivity) {
        try {
          const response = await request.patch(`/activities/${currentActivity._id}`, activityData);
          const updatedActivity = response.data;
          setActivities(prev => prev.map(item => 
            item._id === currentActivity._id ? {
              ...updatedActivity,
              status: updatedActivity.status === 'pending' ? '未开始' : 
                    updatedActivity.status === 'approved' ? '已开始' : 
                    new Date(updatedActivity.endTime) < new Date() ? '已结束' : '已开始'
            } : item
          ));
          setIsModalVisible(false);
        } catch (error) {
          console.error('更新活动失败:', error);
        }
      } else {
        try {
          const response = await request.post('/activities', activityData);
          setActivities(prev => [...prev, response.data]);
          setIsModalVisible(false);
        } catch (error) {
          console.error('添加活动失败:', error);
        }
      }
      loadActivities();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 跳转到活动详情页
  const navigateToDetail = (activityId) => {
    navigate(`/activityDetail/${activityId}`);
  };

  // 检查用户是否有管理权限
  const isAdminOrTeacher = () => {
    return userRole === 'admin' || userRole === 'teacher';
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>校园活动管理</h1>
      
      <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="搜索活动标题"
              enterButton
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="按状态筛选"
              allowClear
              value={searchParams.status}
              onChange={handleStatusChange}
            >
              <Option value="已开始">已开始</Option>
              <Option value="未开始">未开始</Option>
              <Option value="已结束">已结束</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              style={{ width: '100%' }}
              showTime
              onChange={handleDateChange}
            />
          </Col>
        </Row>
      </div>
      
      {isAdminOrTeacher() && (
        <div style={{ marginBottom: '16px', textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showEditModal()}
          >
            添加活动
          </Button>
        </div>
      )}
      
      {loading ? (
        <div>加载中...</div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredActivities.map((activity) => (
            <Col xs={24} sm={12} md={8} lg={6} key={activity._id}>
              <Card
                hoverable
                actions={isAdminOrTeacher() ? [
                  <EditOutlined key="edit" onClick={() => showEditModal(activity)} />,
                  <Popconfirm
                    key="delete"
                    title="确认删除"
                    description={`确定要删除活动 ${activity.title} 吗？`}
                    onConfirm={() => handleDelete(activity._id)}
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
                ] : null}
                onClick={() => !isAdminOrTeacher() && navigateToDetail(activity._id)}
                style={{ cursor: !isAdminOrTeacher() ? 'pointer' : 'default' }}
              >
                <Meta
                  title={
                    <Space>
                      {activity.title}
                      {getStatusTag(activity.status)}
                    </Space>
                  }
                  description={
                    <div>
                      <p>{activity.description}</p>
                      <p><Tag color="blue">{activity.activityType?.name || '未分类'}</Tag></p>                      <p>
                        <CalendarOutlined /> {formatDate(activity.startTime)} - {formatDate(activity.endTime)}
                      </p>
                      <p><EnvironmentOutlined /> {activity.location}</p>
                      <p><TeamOutlined /> 最多 {activity.maxParticipants} 人</p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {isAdminOrTeacher() && (
        <Modal
          title={currentActivity ? '编辑活动' : '添加活动'}
          visible={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              maxParticipants: 50
            }}
          >
            <Form.Item
              name="title"
              label="活动标题"
              rules={[{ required: true, message: '请输入活动标题' }]}
            >
              <Input placeholder="请输入活动标题" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="活动描述"
              rules={[{ required: true, message: '请输入活动描述' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入活动描述" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="活动类型"
                  rules={[{ required: true, message: '请选择活动类型' }]}
                >
                  <Select placeholder="请选择活动类型">
                    {activityTypes.map(type => (
                      <Option key={type._id} value={type._id}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="maxParticipants"
                  label="最大参与人数"
                  rules={[{ required: true, message: '请输入最大参与人数' }]}
                >
                  <Input type="number" placeholder="请输入最大参与人数" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="timeRange"
              label="活动时间"
              rules={[{ required: true, message: '请选择活动时间范围' }]}
            >
              <RangePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="location"
              label="活动地点"
              rules={[{ required: true, message: '请输入活动地点' }]}
            >
              <Input placeholder="请输入活动地点" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default ActivityList;