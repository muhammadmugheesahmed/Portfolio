import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react'; // Imports for the hamburger, close, and theme icons
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Tracks mobile menu open/close status
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Mughees's <span>Portfolio</span>
        </Link>
        
        <div className="nav-right">
          {/* The conditional 'active' class slides the menu in on mobile */}
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''} 
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/recommendations" 
              className={location.pathname === '/recommendations' ? 'active' : ''} 
              onClick={closeMenu}
            >
              Recommendations
            </Link>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''} 
              onClick={closeMenu}
            >
              Contact
            </Link>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
          <span className="track-icon"><Moon size={14} /></span>
          <span className="track-icon"><Sun size={14} /></span>
          <div className={`neumorphic-thumb ${theme}`}>
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </div>
          </button>

          <button className="menu-icon" onClick={toggleMenu} aria-label="Toggle navigation">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}