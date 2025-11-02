'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logEvent } from '@/lib/telemetry';
import { signOut } from '@/lib/auth';
import { getCartCount } from '@/lib/cart';

interface HeaderProps {
  cartItemCount?: number;
}

export default function Header({ cartItemCount: initialCount = 0 }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(initialCount);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);

    // Load cart count
    loadCartCount();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
      loadCartCount();
    };

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleStorageChange);
    window.addEventListener('userLoggedOut', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleStorageChange);
      window.removeEventListener('userLoggedOut', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const loadCartCount = async () => {
    try {
      const count = await getCartCount();
      setCartItemCount(count);
    } catch (error) {
      console.error('Failed to load cart count:', error);
      setCartItemCount(0);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      logEvent('search_submitted', { query: searchQuery });
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/shop" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <span className="text-3xl font-bold text-black hidden sm:block">
              EcomStore
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-gray-700 hover:text-black font-medium transition-colors">
              Shop
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black font-medium transition-colors">
              Contact
            </Link>
            <Link href="/shipping" className="text-gray-700 hover:text-black font-medium transition-colors">
              Shipping
            </Link>
            <Link href="/returns" className="text-gray-700 hover:text-black font-medium transition-colors">
              Returns
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-black font-medium transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* Login/Logout Button */}
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="hidden md:block text-gray-700 hover:text-black font-medium transition-colors"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    localStorage.removeItem('user');
                    localStorage.removeItem('session');
                    setIsLoggedIn(false);
                    window.dispatchEvent(new Event('userLoggedOut'));
                    router.push('/login');
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                }}
                className="hidden md:block text-gray-700 hover:text-black font-medium transition-colors"
              >
                Logout
              </button>
            )}
            
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative group"
              onClick={() => logEvent('cart_icon_clicked')}
            >
              <svg
                className="w-7 h-7 text-gray-700 group-hover:text-black transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-4 border-t">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link href="/shop" className="text-gray-700 hover:text-black font-medium">
                Shop
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-black font-medium">
                Contact
              </Link>
              <Link href="/shipping" className="text-gray-700 hover:text-black font-medium">
                Shipping
              </Link>
              <Link href="/returns" className="text-gray-700 hover:text-black font-medium">
                Returns
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-black font-medium">
                FAQ
              </Link>
              {!isLoggedIn ? (
                <Link href="/login" className="text-gray-700 hover:text-black font-medium">
                  Login
                </Link>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                      localStorage.removeItem('user');
                      localStorage.removeItem('session');
                      setIsLoggedIn(false);
                      window.dispatchEvent(new Event('userLoggedOut'));
                      router.push('/login');
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }}
                  className="text-left text-gray-700 hover:text-black font-medium"
                >
                  Logout
                </button>
              )}
            </nav>
            <form onSubmit={handleSearch} className="mt-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-black"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
