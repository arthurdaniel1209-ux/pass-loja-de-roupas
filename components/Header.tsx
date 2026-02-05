
import React from 'react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'auth') => void;
  isLoggedIn: boolean;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className="text-sm font-medium tracking-wider uppercase border border-white px-4 py-1 transition-colors hover:bg-white hover:text-black"
    >
      {children}
    </a>
  );
};

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onNavigate, isLoggedIn }) => {
  const handleCartClick = () => {
    if (isLoggedIn) {
      alert('Funcionalidade de carrinho não implementada.');
    } else {
      alert('É necessário estar logado para abrir o carrinho.');
      onNavigate('auth');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="font-logo-pass text-4xl tracking-wider text-white cursor-pointer">
              Pass
            </a>
          </div>
          <nav className="hidden md:flex md:space-x-4">
            <NavLink href="#classic">Classic</NavLink>
            <NavLink href="#level-up">Level UP</NavLink>
            <NavLink href="#pass-the-level">Pass the level</NavLink>
            <NavLink href="#pass-sports">Pass Sports</NavLink>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-white transition-colors hover:text-gray-400" aria-label="Pesquisar">
                <SearchIcon className="h-6 w-6" />
            </button>
            <button onClick={() => onNavigate('auth')} className="text-white transition-colors hover:text-gray-400" aria-label="Conta">
                <UserIcon className="h-6 w-6" />
            </button>
            <button onClick={handleCartClick} className="text-white transition-colors hover:text-gray-400" aria-label="Carrinho">
                <CartIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
