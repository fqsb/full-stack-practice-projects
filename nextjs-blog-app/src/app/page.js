import Link from 'next/link';
import { getAllPosts, getAllCategories, getAllTags } from './lib/blog';

export default function Home() {
  const blogPosts = getAllPosts();
  const allCategories = getAllCategories();
  const allTags = getAllTags();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap">
        {/* 侧边栏 */}
        <aside className="w-full md:w-1/4 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">分类</h2>
            <ul className="space-y-2">
              {allCategories.map(category => (
                <li key={category}>
                  <Link href={`/category/${encodeURIComponent(category)}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">标签</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Link 
                  key={tag} 
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>
        
        {/* 主内容区 */}
        <main className="w-full md:w-3/4 px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">最新博客文章</h1>
          
          <div className="space-y-8">
            {blogPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    <Link href={`/blog/${post.id}`} className="text-gray-900 hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">作者: {post.author}</span>
                    <span className="mr-4">发布于: {post.date}</span>
                    {post.comments && (
                      <span>{post.comments.length} 条评论</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  
                  {post.categories && (
                    <div className="mb-4">
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
                    <div className="flex flex-wrap gap-2 mb-4">
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
                  
                  <Link 
                    href={`/blog/${post.id}`} 
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    阅读更多
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
