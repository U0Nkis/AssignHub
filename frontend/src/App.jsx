import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './components/Home/HomePage';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { AssignmentList } from './components/Assignments/AssignmentList';
import { AssignmentForm } from './components/Assignments/AssignmentForm';
import { AssignmentDetails } from './components/Assignments/AssignmentDetails';
import { SubmitAssignment } from './components/Assignments/SubmitAssignment';
import { UserProfile } from './components/Profile/UserProfile';
import { Unauthorized } from './components/Error/Unauthorized';
import { NotFound } from './components/Error/NotFound';
import { CodeEditor } from './components/Code/CodeEditor';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                path="/assignments"
                element={
                  <ProtectedRoute>
                    <AssignmentList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/assignments/new"
                element={
                  <ProtectedRoute roles={['teacher']}>
                    <AssignmentForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/assignments/:id"
                element={
                  <ProtectedRoute>
                    <AssignmentDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/assignments/:id/edit"
                element={
                  <ProtectedRoute roles={['teacher']}>
                    <AssignmentForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/assignments/:id/submit"
                element={
                  <ProtectedRoute roles={['student']}>
                    <SubmitAssignment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/assignments/:id/code"
                element={
                  <ProtectedRoute>
                    <CodeEditor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;