import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>AssignHub</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/assignments" className="nav-item">
            <i className="fas fa-tasks"></i>
            <span>Assignments</span>
          </Link>
          {user?.role === 'teacher' && (
            <Link to="/students" className="nav-item">
              <i className="fas fa-users"></i>
              <span>Students</span>
            </Link>
          )}
          <Link to="/profile" className="nav-item">
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">
              <i className="fas fa-bars"></i>
            </button>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="header-right">
            <div className="notifications">
              <i className="fas fa-bell"></i>
              <span className="badge">3</span>
            </div>
            <div className="user-menu">
              <img src={user?.avatar || 'https://via.placeholder.com/40'} alt="User" className="avatar" />
              <div className="user-info">
                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 