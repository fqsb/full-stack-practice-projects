import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  Button, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Tag,
  Steps,
  Form,
  Input,
  message,
  Spin
} from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  TeamOutlined,
  UserOutlined,

  CheckCircleOutlined
} from '@ant-design/icons';
import { submitRegistration } from '../api/mockData';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import request from '../api/request';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const ActivityDetail = ({ 
  activity: propActivity, 
  visible, 
  onClose,
  onRegisterSuccess
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activity, setActivity] = useState(propActivity);
  const [registerForm] = Form.useForm();
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  const fetchActivityDetail = async () => {
    try {
      const response = await request.get(`/activities/${id}`);
      if (response.data) {
        setActivity(response.data);
      }
    } catch (error) {
      console.error('获取活动详情失败:', error);
      message.error('获取活动详情失败');
    }
  };

  // 获取用户信息并预填充表单
  const fetchUserInfo = async () => {
    try {
      setLoadingUserInfo(true);
      const response = await request.get('/auth/me');
      if (response.data) {
        setUserInfo(response.data);
        
        // 预填充表单数据
        const profile = response.data.profile || {};
        registerForm.setFieldsValue({
          name: profile.name || response.data.username,
          studentId: profile.studentId,
          phone: profile.phone,
          email: response.data.email
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败，请重新登录');
      navigate('/login');
    } finally {
      setLoadingUserInfo(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 如果是路由模式（没有传入activity prop），则需要获取活动数据
  useEffect(() => {
    if (!propActivity && id) {
      fetchActivityDetail();
    }
  }, [id, propActivity]);

  const formatDate = (dateString) => {
    return moment(dateString).format('YYYY-MM-DD HH:mm');
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

  const showRegisterForm = () => {
    // 修改这里，只在模态框模式下调用onClose
    if (onClose) {
      onClose();
    }
    setRegistrationStep(0);
    setRegisterModalVisible(true);
  };

  const handleRegisterCancel = () => {
    setRegisterModalVisible(false);
    // 移除这里的条件判断，因为现在在 handleRegisterSubmit 中直接处理跳转
    setRegistrationStep(0);
  };

  const handleRegisterSubmit = async () => {
    try {
      const values = await registerForm.validateFields();
      
      setRegistrationStep(1);
      
      try {
        await submitRegistration(activity.id, values);
        setTimeout(() => {
          setRegistrationStep(2);
          message.success('报名成功！');
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
          // 修改这里：直接跳转到报名列表页面
          navigate('/registrations');
        }, 1000);
      } catch (error) {
        message.error('报名失败，请稍后重试');
        setRegistrationStep(0);
      }
    } catch (error) {
      console.error('提交报名表单错误:', error);
    }
  };

  // 如果是路由模式且数据还未加载，显示加载状态
  if (!activity && id) {
    return <div style={{ padding: 24 }}>加载中...</div>;
  }

  // 路由模式下的渲染
  if (id) {
    return (
      <div style={{ padding: 24 }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/* <img 
              // src={activity?.imageUrl || '/image/a.png'}
              alt={activity?.title}
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/image/a.png';
              }}
            /> */}
          </div>
          
          <Title level={3}>{activity?.title} {activity && getStatusTag(activity.status)}</Title>
          
          <Paragraph>
            <Text strong>活动描述：</Text> {activity?.description}
          </Paragraph>
          
          <Divider />
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Paragraph>
                <CalendarOutlined /> <Text strong>开始时间：</Text> {activity && formatDate(activity.startTime)}
              </Paragraph>
            </Col>
            <Col span={12}>
              <Paragraph>
                <CalendarOutlined /> <Text strong>结束时间：</Text> {activity && formatDate(activity.endTime)}
              </Paragraph>
            </Col>
          </Row>
          
          <Paragraph>
            <EnvironmentOutlined /> <Text strong>活动地点：</Text> {activity?.location}
          </Paragraph>
          
          <Paragraph>
            <TeamOutlined /> <Text strong>最大参与人数：</Text> {activity?.maxParticipants}人
          </Paragraph>
          
          <Paragraph>
            <Text strong>活动类型：</Text> <Tag color="blue">{activity?.activityType?.name}</Tag>
          </Paragraph>
          
          <Divider />
          
          <Paragraph>
            <Text type="secondary">
              报名参加活动即表示您同意遵守活动规则和要求。活动开始前请提前到达现场签到。
            </Text>
          </Paragraph>

          <Button 
            type="primary" 
            onClick={showRegisterForm}
            disabled={activity?.status === '已结束'}
          >
            立即报名
          </Button>
        </div>

        {/* 报名表单模态窗口 */}
        <Modal
          title="活动报名"
          open={registerModalVisible}
          onCancel={handleRegisterCancel}
          footer={
            registrationStep === 2 ? [
              <Button key="close" type="primary" onClick={handleRegisterCancel}>
                完成
              </Button>
            ] : null
          }
          width={600}
        >
          {loadingUserInfo ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <Spin size="large" />
              <p>正在加载用户信息...</p>
            </div>
          ) : (
            <>
              <Steps current={registrationStep} style={{ marginBottom: '30px' }}>
                <Step title="填写信息" description="确认个人信息" />
                <Step title="提交中" description="正在提交报名信息" />
                <Step title="报名成功" description="您已成功报名" />
              </Steps>

              {registrationStep === 0 && (
                <Form
                  form={registerForm}
                  layout="vertical"
                  onFinish={handleRegisterSubmit}
                >
                  <Form.Item
                    name="name"
                    label="姓名"
                  >
                    <Input prefix={<UserOutlined />} readOnly />
                  </Form.Item>
                  
                  <Form.Item
                    name="studentId"
                    label="学号"
                  >
                    <Input readOnly />
                  </Form.Item>
                  
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                  ]}
                  >
                  <Input placeholder="请输入联系电话" />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    label="邮箱"
                  >
                    <Input readOnly />
                  </Form.Item>
                  
                  <Form.Item
                    name="reason"
                    label="参加原因"
                    rules={[{ required: true, message: '请输入参加活动的原因' }]}
                  >
                    <Input.TextArea rows={3} placeholder="请简述您参加活动的原因" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      提交报名
                    </Button>
                  </Form.Item>
                </Form>
              )}

              {registrationStep === 1 && (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <Spin size="large" />
                  <p style={{ marginTop: '16px' }}>正在提交您的报名信息，请稍候...</p>
                </div>
              )}

              {registrationStep === 2 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircleOutlined style={{ fontSize: '72px', color: '#52c41a', marginBottom: '20px' }} />
                  <Title level={4}>恭喜您，报名成功！</Title>
                  <Paragraph>
                    您已成功报名 <Text strong>{activity?.title}</Text>
                  </Paragraph>
                  <Paragraph type="secondary">
                    活动将于 {activity && formatDate(activity.startTime)} 开始，请提前安排好时间参加。
                  </Paragraph>
                  <Paragraph type="secondary">
                    活动地点：{activity?.location}
                  </Paragraph>
                </div>
              )}
            </>
          )}
        </Modal>
      </div>
    );
  }

  // 模态框模式的渲染
  return (
    <>
      <Modal
        title="活动详情"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>
            关闭
          </Button>,
          <Button 
            key="register" 
            type="primary" 
            onClick={showRegisterForm}
            disabled={activity?.status === '已结束'}
          >
            立即报名
          </Button>,
        ]}
        width={700}
      >
        {activity && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img 
                src={activity.imageUrl || '/image/a.png'}
                alt={activity.title}
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/image/a.png';
                }}
              />
            </div>
            
            <Title level={3}>{activity.title} {getStatusTag(activity.status)}</Title>
            
            <Paragraph>
              <Text strong>活动描述：</Text> {activity.description}
            </Paragraph>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Paragraph>
                  <CalendarOutlined /> <Text strong>开始时间：</Text> {formatDate(activity.startTime)}
                </Paragraph>
              </Col>
              <Col span={12}>
                <Paragraph>
                  <CalendarOutlined /> <Text strong>结束时间：</Text> {formatDate(activity.endTime)}
                </Paragraph>
              </Col>
            </Row>
            
            <Paragraph>
              <EnvironmentOutlined /> <Text strong>活动地点：</Text> {activity.location}
            </Paragraph>
            
            <Paragraph>
              <TeamOutlined /> <Text strong>最大参与人数：</Text> {activity.maxParticipants}人
            </Paragraph>
            
            <Paragraph>
              <Text strong>活动类型：</Text> <Tag color="blue">{activity.activityType?.name}</Tag>
            </Paragraph>
            <Divider />
            
            <Paragraph>
              <Text type="secondary">
                报名参加活动即表示您同意遵守活动规则和要求。活动开始前请提前到达现场签到。
              </Text>
            </Paragraph>
          </div>
        )}
      </Modal>

      {/* 报名表单模态窗口 */}
      <Modal
        title="活动报名"
        open={registerModalVisible}
        onCancel={handleRegisterCancel}
        footer={
          registrationStep === 2 ? [
            <Button key="close" type="primary" onClick={handleRegisterCancel}>
              完成
            </Button>
          ] : null
        }
        width={600}
      >
        {loadingUserInfo ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Spin size="large" />
            <p>正在加载用户信息...</p>
          </div>
        ) : (
          <>
            <Steps current={registrationStep} style={{ marginBottom: '30px' }}>
              <Step title="填写信息" description="确认个人信息" />
              <Step title="提交中" description="正在提交报名信息" />
              <Step title="报名成功" description="您已成功报名" />
            </Steps>

            {registrationStep === 0 && (
              <Form
                form={registerForm}
                layout="vertical"
                onFinish={handleRegisterSubmit}
              >
                <Form.Item
                  name="name"
                  label="姓名"
                >
                  <Input prefix={<UserOutlined />} readOnly />
                </Form.Item>
                
                <Form.Item
                  name="studentId"
                  label="学号"
                >
                  <Input readOnly />
                </Form.Item>
                
                <Form.Item
                  name="phone"
                  label="联系电话"
                  rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                  ]}
                >
                <Input placeholder="请输入联系电话" />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  label="邮箱"
                >
                  <Input readOnly />
                </Form.Item>
                
                <Form.Item
                  name="reason"
                  label="参加原因"
                  rules={[{ required: true, message: '请输入参加活动的原因' }]}
                >
                  <Input.TextArea rows={3} placeholder="请简述您参加活动的原因" />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    提交报名
                  </Button>
                </Form.Item>
              </Form>
            )}

            {registrationStep === 1 && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <Spin size="large" />
                <p style={{ marginTop: '16px' }}>正在提交您的报名信息，请稍候...</p>
              </div>
            )}

            {registrationStep === 2 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircleOutlined style={{ fontSize: '72px', color: '#52c41a', marginBottom: '20px' }} />
                <Title level={4}>恭喜您，报名成功！</Title>
                <Paragraph>
                  您已成功报名 <Text strong>{activity?.title}</Text>
                </Paragraph>
                <Paragraph type="secondary">
                  活动将于 {activity && formatDate(activity.startTime)} 开始，请提前安排好时间参加。
                </Paragraph>
                <Paragraph type="secondary">
                  活动地点：{activity?.location}
                </Paragraph>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default ActivityDetail;