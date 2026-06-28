import React, { useEffect, useState } from "react";
import { Menu, Layout } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Sider, Content } = Layout;

const getMenuItems = (role) => {
  const commonItems = [
    <Menu.Item key="activities">
      <Link to="/activities">活动列表</Link>
    </Menu.Item>
  ];

  if (role === 'student') {
    return [
      ...commonItems,
      <Menu.Item key="registrations">
        <Link to="/registrations">报名列表</Link>
      </Menu.Item>
    ];
  }

  if (role === 'teacher') {
    return commonItems;
  }

  if (role === 'admin') {
    return [
      <Menu.Item key="users">
        <Link to="/users">用户列表</Link>
      </Menu.Item>,
      <Menu.Item key="types">
        <Link to="/types">活动类型</Link>
      </Menu.Item>,
      ...commonItems,
      <Menu.Item key="registrations">
        <Link to="/registrations">报名列表</Link>
      </Menu.Item>,
      <Menu.Item key="approvals">
        <Link to="/approvals">审核列表</Link>
      </Menu.Item>
    ];
  }

  return [];
};

const LayoutComponent = ({ children }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('UserRole');
    setRole(userRole);
    updateSelectedKeys();
  }, [location.pathname]);

  const updateSelectedKeys = () => {
    const { pathname } = location;
    let selectedKey = pathname.split('/')[1] || '';
    setSelectedKeys([selectedKey]);
  };

  const handleMenuItemClick = ({ key }) => {
    setSelectedKeys([key]);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuItemClick}
        >
          {getMenuItems(role)}
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px" }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;