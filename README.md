# 全栈练习项目合集

这是一个整理后的 Web 全栈项目合集，主要用于记录 React、Next.js、Node.js、Express、MongoDB 等技术的学习和实践。仓库中保留了几个相对完整、适合展示的项目，并移除了隐私配置、依赖目录和构建产物。

## 项目一：校园活动管理系统

目录：`campus-activity-management-system`

这是一个前后端分离的校园活动管理系统，适合用于学校社团活动、讲座、比赛、志愿活动等场景的报名和审批管理。

### 技术栈

- 前端：React、React Router、Ant Design、Axios
- 后端：Node.js、Express、MongoDB、Mongoose
- 认证：JWT、bcryptjs
- 权限：AccessControl

### 前端功能

- 用户登录、注册
- 首页、关于页、顶部导航和整体布局
- 活动列表展示
- 按活动标题搜索
- 按活动状态筛选
- 按时间范围筛选
- 活动详情查看
- 学生报名活动
- 报名记录列表
- 活动审批页面
- 活动分类管理
- 用户列表管理
- 个人资料查看与编辑

### 后端功能

- 用户注册、登录
- JWT 身份认证
- 密码加密存储
- 学生、教师、管理员三类角色
- 基于角色的接口权限控制
- 活动增删改查
- 活动分类增删改查
- 活动报名与报名记录管理
- 报名状态更新
- 活动审批与批量审批
- 通知管理
- 管理员用户管理
- 系统统计接口

### 适合展示的亮点

- 前后端分离结构清晰
- 包含登录认证和角色权限
- 业务流程比较完整：发布活动、审批活动、学生报名、查看报名记录
- 后端按路由、控制器、模型、中间件进行拆分

## 项目二：Next.js 博客系统

目录：`nextjs-blog-app`

这是一个基于 Next.js 的博客系统示例，主要展示博客类网站常见的页面结构和内容展示方式。

### 技术栈

- Next.js
- React
- Tailwind CSS
- React Markdown
- remark-gfm

### 主要功能

- 博客首页
- 文章列表展示
- 文章详情页
- Markdown 内容渲染
- 分类页面
- 标签页面
- 评论展示
- 本地模拟评论提交
- 关于页面
- 公共导航栏和页脚组件

### 适合展示的亮点

- 使用 Next.js App Router 组织页面
- 支持 Markdown 博客内容渲染
- 有分类、标签、评论等博客基础模块
- 页面结构适合作为个人博客或内容网站的基础模板

## 项目三：学生与班级管理 API

目录：`student-management-system-api`

这是一个基于 Express 和 MongoDB 的后端 API 示例，用于管理学生和班级数据。

### 技术栈

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv

### 主要功能

- 添加学生
- 查询学生列表
- 根据 ID 查询学生
- 更新学生信息
- 删除学生
- 添加班级
- 查询班级列表
- 根据 ID 查询班级
- 更新班级信息
- 删除班级
- 学生关联班级
- 统计学生总数
- 按性别统计学生数量

### 适合展示的亮点

- RESTful API 结构简单清晰
- 使用 Mongoose 定义学生和班级模型
- 包含基础 CRUD 和简单聚合统计
- 适合展示后端接口开发基础能力

## 仓库结构

```text
full-stack-practice-projects/
├── campus-activity-management-system/
│   ├── frontend/
│   └── backend/
├── nextjs-blog-app/
├── student-management-system-api/
└── README.md
```

## 隐私与安全处理

为了适合公开上传，本仓库已经做了以下清理：

- 删除 `.env` 环境变量文件
- 删除 `node_modules` 依赖目录
- 删除 `.next`、`build`、`dist` 等构建产物
- 删除原始压缩包
- 删除包含测试账号、密码、Token、数据库对象 ID 的 HTTP 请求示例文件
- 保留 `.env.example` 作为本地配置模板

## 本地运行方式

进入需要运行的项目目录后，先安装依赖：

```bash
npm install
```

如果项目中有 `.env.example`，复制一份为 `.env`，并根据本地环境修改配置。

启动方式请查看对应项目的 `package.json`。常见命令如下：

```bash
npm run dev
```

或：

```bash
npm start
```

## 后续可完善方向

- 补充接口文档
- 增加页面截图
- 增加在线部署地址
- 优化前端页面样式
- 增加表单校验和错误提示
- 增加单元测试或接口测试

## 说明

本仓库主要用于学习记录和作品展示。部分项目仍保留课程练习痕迹，后续可以继续完善为更规范的生产级项目。
