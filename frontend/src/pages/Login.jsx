import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      alert('Неверные учетные данные');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl mb-4">Вход</h2>
          <input
              type="text"
              placeholder="Имя пользователя"
              className="w-full p-2 mb-4 border rounded"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
              type="password"
              placeholder="Пароль"
              className="w-full p-2 mb-4 border rounded"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Войти
          </button>
        </form>
      </div>
  );
};

export default Login;
