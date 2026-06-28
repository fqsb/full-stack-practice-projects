// 博客数据服务

// 博客文章数据
export const blogPosts = [
  {
    id: '1',
    title: '初识 Next.js',
    excerpt: 'Next.js 是一个轻量级的 React 服务端渲染应用框架。',
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
    date: '2023-05-15',
    author: '张三',
    categories: ['前端开发', 'React'],
    tags: ['Next.js', 'React', 'SSR'],
    comments: [
      {
        id: '101',
        author: '李四',
        content: '这篇文章非常有帮助，谢谢分享！',
        date: '2023-05-16'
      },
      {
        id: '102',
        author: '王五',
        content: '我最近也在学习Next.js，这篇文章解答了我很多疑惑。',
        date: '2023-05-17'
      }
    ]
  },
  {
    id: '2',
    title: 'React Hooks 详解',
    excerpt: '深入了解 React Hooks 的使用方法和注意事项。',
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
    date: '2023-06-20',
    author: '张三',
    categories: ['前端开发', 'React'],
    tags: ['React Hooks', 'React', '函数组件'],
    comments: [
      {
        id: '201',
        author: '赵六',
        content: '这篇文章讲解得很清楚，对我理解Hooks很有帮助。',
        date: '2023-06-21'
      }
    ]
  },
  {
    id: '3',
    title: '服务端组件与客户端组件',
    excerpt: 'Next.js 中服务端组件和客户端组件的区别与使用场景。',
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
    date: '2023-07-10',
    author: '张三',
    categories: ['前端开发', 'React'],
    tags: ['Next.js', 'React', '服务端组件'],
    comments: [
      {
        id: '301',
        author: '孙七',
        content: '这个概念解释得很清楚，感谢分享！',
        date: '2023-07-11'
      },
      {
        id: '302',
        author: '周八',
        content: '服务端组件确实是Next.js的一大亮点。',
        date: '2023-07-12'
      },
      {
        id: '303',
        author: '吴九',
        content: '我还是不太理解什么场景下应该使用客户端组件？',
        date: '2023-07-13'
      }
    ]
  }
];

// 获取所有博客文章
export function getAllPosts() {
  return blogPosts;
}

// 获取特定博客文章
export function getPostById(id) {
  return blogPosts.find(post => post.id === id);
}

// 获取所有分类
export function getAllCategories() {
  const categoriesSet = new Set();
  
  blogPosts.forEach(post => {
    if (post.categories) {
      post.categories.forEach(category => categoriesSet.add(category));
    }
  });
  
  return Array.from(categoriesSet);
}

// 获取所有标签
export function getAllTags() {
  const tagsSet = new Set();
  
  blogPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet);
}

// 按分类获取文章
export function getPostsByCategory(category) {
  return blogPosts.filter(post => 
    post.categories && post.categories.includes(category)
  );
}

// 按标签获取文章
export function getPostsByTag(tag) {
  return blogPosts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

// 添加评论
export function addComment(postId, comment) {
  const post = getPostById(postId);
  if (!post) return null;
  
  if (!post.comments) {
    post.comments = [];
  }
  
  const newComment = {
    id: Date.now().toString(),
    ...comment,
    date: new Date().toISOString().split('T')[0]
  };
  
  post.comments.push(newComment);
  return newComment;
} 