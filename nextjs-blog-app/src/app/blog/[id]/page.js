'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostById, addComment } from '../../lib/blog';

// 模拟博客数据
const blogPosts = [
  {
    id: '1',
    title: '初识 Next.js',
    content: `
      # 初识 Next.js
      
      Next.js 是一个轻量级的 React 服务端渲染应用框架。它可以帮助开发者轻松构建服务端渲染的 React 应用，同时支持静态网站生成（SSG）。
      
      ## 主要特点
      
      - **服务端渲染（SSR）**：提高首屏加载速度和SEO
      - **静态网站生成（SSG）**：预渲染页面，提供更快的用户体验
      - **文件系统路由**：基于文件系统的直观路由
      - **API 路由**：轻松创建 API 端点
      - **内置 CSS 和 Sass 支持**：简化样式处理
      - **自动代码分割**：优化页面加载性能
      
      通过使用 Next.js，我们可以构建高性能的 React 应用，同时享受开发过程中的便利性。
    `,
    date: '2023-05-15'
  },
  {
    id: '2',
    title: 'React Hooks 详解',
    content: `
      # React Hooks 详解
      
      React Hooks 是 React 16.8 版本引入的新特性，它允许开发者在不编写类组件的情况下使用状态和其他 React 特性。
      
      ## 常用的 Hooks
      
      ### useState
      
      \`\`\`jsx
      const [state, setState] = useState(initialState);
      \`\`\`
      
      ### useEffect
      
      \`\`\`jsx
      useEffect(() => {
        // 副作用代码
        return () => {
          // 清理函数
        };
      }, [dependencies]);
      \`\`\`
      
      ### useContext
      
      \`\`\`jsx
      const value = useContext(MyContext);
      \`\`\`
      
      Hooks 的引入大大简化了 React 组件的编写，使代码更加简洁和易于理解。
    `,
    date: '2023-06-20'
  },
  {
    id: '3',
    title: '服务端组件与客户端组件',
    content: `
      # 服务端组件与客户端组件
      
      Next.js 引入了服务端组件和客户端组件的概念，这是 React 组件模型的一个扩展。
      
      ## 服务端组件
      
      服务端组件在服务器上渲染，不包含任何客户端交互逻辑。它们适合:
      
      - 访问后端资源
      - 隐藏敏感信息
      - 减少客户端 JavaScript 包的大小
      
      ## 客户端组件
      
      客户端组件在浏览器中渲染，适合需要交互的界面部分:
      
      - 使用事件监听器
      - 使用浏览器 API
      - 使用状态或生命周期方法
      
      通过合理选择组件的渲染位置，我们可以优化应用性能并提供更好的用户体验。
    `,
    date: '2023-07-10'
  }
];

export default function BlogPost({ params }) {
  const { id } = params;
  const post = getPostById(id);
  
  const [commentForm, setCommentForm] = useState({
    author: '',
    content: ''
  });
  const [comments, setComments] = useState(post?.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4 text-red-600">博客未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，您请求的博客文章不存在。</p>
          <Link 
            href="/" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!commentForm.author.trim() || !commentForm.content.trim()) {
      setFormError('姓名和评论内容不能为空');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    // 添加评论
    const newComment = addComment(id, commentForm);
    
    // 更新评论列表
    setComments(prev => [...prev, newComment]);
    
    // 重置表单
    setCommentForm({
      author: '',
      content: ''
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-8">
          {/* 文章头部 */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{post.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <span className="mr-4">作者: {post.author}</span>
              <span className="mr-4">发布于: {post.date}</span>
              <span>{comments.length} 条评论</span>
            </div>
            
            {/* 分类和标签 */}
            {post.categories && (
              <div className="mb-2">
                <span className="text-sm text-gray-500 mr-2">分类:</span>
                {post.categories.map((category, index) => (
                  <span key={category}>
                    <Link href={`/category/${encodeURIComponent(category)}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                      {category}
                    </Link>
                    {index < post.categories.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
            
            {post.tags && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link 
                    key={tag} 
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="px-2 py-1 bg-gray-100 text-xs rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>
          
          {/* 文章内容 */}
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
      
      {/* 评论区 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">评论 ({comments.length})</h2>
        
        {/* 评论列表 */}
        {comments.length > 0 ? (
          <div className="space-y-6 mb-8">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-gray-900 mr-2">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">暂无评论，成为第一个评论的人吧！</p>
        )}
        
        {/* 评论表单 */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-900">发表评论</h3>
          
          {formError && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmitComment}>
            <div className="mb-4">
              <label htmlFor="author" className="block text-gray-700 mb-2">
                姓名
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={commentForm.author}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="请输入您的姓名"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 mb-2">
                评论内容
              </label>
              <textarea
                id="content"
                name="content"
                value={commentForm.content}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="请输入您的评论"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isSubmitting ? '提交中...' : '提交评论'}
            </button>
          </form>
        </div>
      </div>
      
      {/* 返回链接 */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回博客列表
        </Link>
      </div>
    </div>
  );
} 