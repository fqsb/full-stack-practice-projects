import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link href="/">
            博客系统
          </Link>
        </h1>
        <nav className="nav">
          <ul>
            <li>
              <Link href="/">
                首页
              </Link>
            </li>
            <li>
              <Link href="/about">
                关于
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 