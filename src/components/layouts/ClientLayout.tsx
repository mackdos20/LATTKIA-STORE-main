import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiMenu, FiX, FiSun, FiMoon, FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              LATTKIA
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                المنتجات
              </Link>
              <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                الأقسام
              </Link>
              <Link href="/offers" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                العروض
              </Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                عنا
              </Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                اتصل بنا
              </Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiSearch className="w-5 h-5" />
              </button>
              
              <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <FiShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link href="/account" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiUser className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                المنتجات
              </Link>
              <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                الأقسام
              </Link>
              <Link href="/offers" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                العروض
              </Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                عنا
              </Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                اتصل بنا
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">عن المتجر</h3>
              <p className="text-gray-600 dark:text-gray-400">
                متجر لاتكيا يقدم أفضل المنتجات بأسعار تنافسية وجودة عالية.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    عنا
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    سياسة الخصوصية
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">خدمة العملاء</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    الأسئلة الشائعة
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    الشحن والتوصيل
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    الإرجاع والاستبدال
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 dark:text-gray-400">
                  البريد الإلكتروني: info@lattkia.com
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  الهاتف: +1234567890
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} LATTKIA. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 