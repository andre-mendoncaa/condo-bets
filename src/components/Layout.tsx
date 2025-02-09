import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, ListPlus, LogOut } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/bets"
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                <ListPlus className="h-5 w-5 mr-2" />
                Apostas
              </Link>
              <Link
                to="/calculator"
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Calculadora
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
