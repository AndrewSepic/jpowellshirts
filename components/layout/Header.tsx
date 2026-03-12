import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="bg-[#f4f7fa] border-b border-slate-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="max-w-40 lg:max-w-60 font-bold text-sky-800 hover:text-sky-600 transition-colors font-brand">
           <Logo />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-sky-700 transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-sky-700 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/cart" 
              className="flex items-center text-slate-600 hover:text-sky-700 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span className="ml-1">Cart</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
