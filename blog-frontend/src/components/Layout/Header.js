import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/" className="logo">BLOG APP</Link>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {user.isLoggedIn ? (
            <>
              <li><Link to="/new-blog">Create Blog</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/my-blogs">My Blogs</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
