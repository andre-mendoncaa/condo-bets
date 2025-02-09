import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BetsList from './pages/BetsList';
import Layout from './components/Layout';
import Calculator from './pages/Calculator';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (session) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  return children;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/bets"
          element={
            <PrivateRoute>
              <Layout>
                <BetsList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/calculator"
          element={
            <PrivateRoute>
              <Layout>
                <Calculator />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
      </HashRouter>
  );
}

export default App;
