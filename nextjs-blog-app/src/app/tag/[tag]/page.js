import Link from 'next/link';
import { getPostsByTag } from '../../lib/blog';

export default function TagPage({ params }) {
  const { tag } = params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        标签: {decodedTag}
      </h1>
      
      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map(post => (
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
      ) : (
        <p className="text-gray-600">
          该标签下暂无文章。
        </p>
      )}
      
      <div className="mt-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>
    </div>
  );
} 