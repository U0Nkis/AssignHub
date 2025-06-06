import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AssignHub</Link>
      </div>

      {user && (
        <div className="navbar-menu">
          <Link to="/assignments" className="navbar-item">
            Assignments
          </Link>

          {user.role === 'teacher' && (
            <Link to="/assignments/new" className="navbar-item">
              Create Assignment
            </Link>
          )}

          <div className="navbar-end">
            <div className="navbar-item has-dropdown">
              <div className="navbar-link">
                {user.first_name} {user.last_name}
              </div>
              <div className="navbar-dropdown">
                <Link to="/profile" className="navbar-item">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="navbar-item"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}; 