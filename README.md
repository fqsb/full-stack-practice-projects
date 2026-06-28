# 全栈练习项目合集

这是一个整理后的全栈 Web 项目合集，包含 React、Next.js、Express、MongoDB 等技术栈的练习项目和系统雏形。仓库内容已经做过公开化清理，适合放在 GitHub 上作为学习记录或作品展示。

## 项目目录

### `campus-activity-management-system`

校园活动管理系统，包含前端和后端两部分。

- `frontend`：React + Ant Design 前端页面
- `backend`：Express + MongoDB 后端接口

主要功能：

- 用户注册、登录
- JWT 身份认证
- 学生、教师、管理员三类角色
- 活动列表、活动详情、活动筛选
- 活动创建、编辑、删除
- 活动分类管理
- 活动报名与报名记录
- 活动审批与批量审批
- 通知管理
- 用户管理与个人资料维护

### `nextjs-blog-app`

基于 Next.js 的博客系统示例。

主要功能：

- 博客首页
- 文章详情页
- Markdown 内容渲染
- 分类筛选
- 标签筛选
- 本地模拟评论
- 关于页面

### `student-management-system-api`

学生与班级管理 API 示例。

主要功能：

- 学生信息增删改查
- 班级信息增删改查
- 学生关联班级
- 学生总数统计
- 按性别统计学生数量

## 技术栈

- 前端：React、React Router、Ant Design、Next.js、Tailwind CSS
- 后端：Node.js、Express
- 数据库：MongoDB、Mongoose
- 认证与权限：JWT、bcryptjs、AccessControl

## 隐私与安全处理

为了适合公开上传，本仓库已移除或排除以下内容：

- `.env` 环境变量文件
- `node_modules` 依赖目录
- `.next`、`build`、`dist` 等构建产物
- 原始压缩包
- 包含测试账号、密码、Token、数据库对象 ID 的 HTTP 请求示例文件

需要本地运行时，请复制对应项目中的 `.env.example` 为 `.env`，再填写自己的本地配置。

## 本地运行

进入对应项目目录后安装依赖：

```bash
npm install
```

根据项目中的 `.env.example` 创建 `.env` 文件，然后查看 `package.json` 中的脚本启动项目。

常见启动方式：

```bash
npm run dev
```

或：

```bash
npm start
```

## 说明

本仓库主要用于学习、练习和作品展示。部分项目仍保留课程练习痕迹，后续可以继续完善部署配置、接口文档、页面样式和测试用例。
