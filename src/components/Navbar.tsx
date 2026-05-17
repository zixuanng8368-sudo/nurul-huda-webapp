import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession, authClient } from '../lib/auth-client';

const Navbar = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  
  // State for managing the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home',              href: '/'       },
    { name: 'Carta Organisasi',  href: '/carta'  },
    { name: 'Sejarah Masjid',    href: '/sejarah'},
  ];

  // Check if the user has an admin-level role
  const isAdmin = session?.user?.role && ["admin", "financeadmin", "superadmin"].includes(session.user.role);

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

        {session ? (
          <div className="relative" ref={dropdownRef}>
            {/* Account Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-medium transition focus:outline-none"
            >
              <span className="max-w-[100px] truncate">{session.user?.name || "Akaun"}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                
                {/* Conditional Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* User Settings */}
                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tetapan Akaun
                </Link>

                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  Log Keluar
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition"
          >
            Log Masuk
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;