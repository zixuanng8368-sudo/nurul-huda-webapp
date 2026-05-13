import { Link, useNavigate } from 'react-router-dom';
import { useSession,authClient } from '../lib/auth-client';
const Navbar = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home',              href: '/'       },
    { name: 'Carta Organisasi',  href: '/carta'  },
    { name: 'Sejarah Masjid',    href: '/sejarah'},
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

        {session ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium transition"
          >
            Log Keluar
          </button>
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