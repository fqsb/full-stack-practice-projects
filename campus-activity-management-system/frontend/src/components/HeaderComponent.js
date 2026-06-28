import React, { useState, useEffect } from "react";
import { Menu, Space } from "antd";
import { Link, useLocation } from "react-router-dom";

const HeaderComponent = () => {
  const [current, setCurrent] = useState('home');
  const location = useLocation();

  useEffect(() => {
    // 根据路由更新选中状态
    if (location.pathname.includes('/about')) {
      setCurrent('about');
    } else if (location.pathname.includes('/users')) {
      setCurrent('users');
    } else {
      setCurrent('home');
    }
  }, [location.pathname]);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className="header">
      <Menu 
        onClick={handleClick} 
        selectedKeys={[current]} 
        mode="horizontal"
        theme="dark"
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="home">
          <Link to="/home">首页</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link to="/about">关于</Link>
        </Menu.Item>
        <Menu.Item key="users">
          <Link to="/users">用户列表</Link>
        </Menu.Item>
        {/* <Menu.Item key="activities">
          <Link to="/activities">活动列表</Link>
        </Menu.Item> */}
        
        {/* 将登录和注册放在最右侧 */}
        <Menu.Item key="profile" style={{ marginLeft: 'auto' }}>
          <Link to="/profile">个人信息</Link>
        </Menu.Item>
        <Menu.Item key="login">
          <Link to="/login">登录</Link>
        </Menu.Item>
        <Menu.Item key="register">
          <Link to="/register">注册</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default HeaderComponent;