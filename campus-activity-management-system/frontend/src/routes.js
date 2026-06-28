import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';
import HomePage from "./components/HomePage";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import RegistrationList from "./components/RegistrationList";
import ApprovalList from "./components/ApprovalList";
import CategoryManagement from './components/CategoryManagement';
import UserProfile from "./components/UserProfile"; 
import AboutPage from "./components/AboutPage";
import HeaderComponent from "./components/HeaderComponent"; // 引入头部组件
import FooterComponent from "./components/FooterComponent"; // 引入底部组件
import LayoutComponent from "./Layout";

const AppRouter = () => (
  <Router>
    <HeaderComponent /> {/* 添加头部组件 */}
    <LayoutComponent>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/registrations" element={<RegistrationList />} />
        <Route path="/activityDetail/:id" element={<ActivityDetail />} />
        <Route path="/approvals" element={<ApprovalList />} />
        <Route path="/types" element={<CategoryManagement />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/activities" element={<ActivityList />}/>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </LayoutComponent>
    <FooterComponent /> {/* 添加底部组件 */}
  </Router>
);

export default AppRouter;