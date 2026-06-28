import React from 'react';
import { Card, Row, Col } from 'antd';

const HomePage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>欢迎来到首页</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="产品特点">
            <p>1. 高效性能</p>
            <p>2. 易于使用</p>
            <p>3. 强大功能</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="最新动态">
            <p>• 版本 1.0 发布</p>
            <p>• 新增用户反馈功能</p>
            <p>• 优化系统性能</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="快速开始">
            <p>1. 注册账号</p>
            <p>2. 浏览功能</p>
            <p>3. 开始使用</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;