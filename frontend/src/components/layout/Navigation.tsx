'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  currentPage?: 'home' | 'articles' | 'profile' | 'search';
  initialSearchKeyword?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage = 'home', initialSearchKeyword = '' }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState(initialSearchKeyword);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/search/${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const navItems = [
    { name: 'Home', href: '/', current: currentPage === 'home' },
    { name: 'Articles', href: '/articles', current: currentPage === 'articles' },
  ];

  return (
    <nav className="nav-apple sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="typography-heading-3 text-foreground">
                Blog System
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'text-foreground border-b-2 border-accent'
                      : 'text-secondary hover:text-foreground'
                  } inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 搜索框 */}
          <div className="flex items-center mx-4 flex-grow max-w-md">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  className="input-apple py-2 pl-4 pr-10"
                  placeholder="Search articles..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </form>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-6">
            {isAuthenticated ? (
              <>
                {currentPage === 'articles' && (
                  <Link
                    href="/articles/new"
                    className="btn-apple-secondary px-4 py-2 text-sm"
                  >
                    Write Article
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={`${
                    currentPage === 'profile'
                      ? 'text-foreground'
                      : 'text-secondary hover:text-foreground'
                  } text-sm font-medium`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-secondary hover:text-foreground text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-secondary hover:text-foreground text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-apple-primary px-4 py-2 text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;