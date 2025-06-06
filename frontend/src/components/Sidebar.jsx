import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="w-64 bg-gray-800 text-white p-4">
            <h1 className="text-2xl mb-6">Система заданий</h1>
            <nav className="space-y-2">
                <NavLink
                    to="/dashboard/assignments"
                    className="block p-2 rounded hover:bg-gray-700"
                    activeClassName="bg-gray-700"
                >
                    Задания
                </NavLink>
                <NavLink
                    to="/dashboard/submissions"
                    className="block p-2 rounded hover:bg-gray-700"
                    activeClassName="bg-gray-700"
                >
                    Решения
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 rounded hover:bg-gray-700"
                >
                    Выйти
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
