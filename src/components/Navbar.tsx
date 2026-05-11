import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Carta Organisasi', href: '/carta' },
    { name: 'Sejarah Masjid', href: '/sejarah' },
    { name: '', href: '#' }, // Empty slot 1
    { name: '', href: '#' }, // Empty slot 2
    { name: '', href: '#' }, // Empty slot 3
  ];

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <a href="/" className="logo">Masjid Kita</a>
        
        <ul className="nav-menu">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link to={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;