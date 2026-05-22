import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, LogOut, Menu, X, BarChart2, List, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <TrendingUp size={22} />
        <span>ExpenseTrack</span>
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link to="/expenses" className="nav-link" onClick={() => setMenuOpen(false)}>
          <List size={16} /> Expenses
        </Link>
        <Link to="/analytics" className="nav-link" onClick={() => setMenuOpen(false)}>
          <BarChart2 size={16} /> Analytics
        </Link>
        <div className="nav-user">
          <span className="user-name">{user?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
