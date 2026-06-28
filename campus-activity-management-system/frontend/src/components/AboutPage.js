import React from 'react';
import { Descriptions, Divider } from 'antd';

const AboutPage = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>关于我们</h1>
      <Divider orientation="left">公司简介</Divider>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="公司名称">蔷薇科技有限公司</Descriptions.Item>
        <Descriptions.Item label="成立时间">2025年</Descriptions.Item>
        <Descriptions.Item label="公司地址">南昌市新建区</Descriptions.Item>
        <Descriptions.Item label="主营业务">软件开发、技术服务</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">团队介绍</Divider>
      <p>
        我们是一支由资深工程师和设计师组成的团队，专注于为用户提供优质的产品体验。
        团队成员来自国内外知名高校和企业，拥有丰富的行业经验。
      </p>

      <Divider orientation="left">联系方式</Divider>
      <p>邮箱: contact@example.com</p>
      <p>电话: 010-12345678</p>
    </div>
  );
};

export default AboutPage;