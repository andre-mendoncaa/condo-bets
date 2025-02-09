import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, ListPlus, LogOut, Calculator, BadgeDollarSign } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Navegação */}
            <div className="flex items-center space-x-6">
              <BadgeDollarSign className="h-5 w-5 mr-2"></BadgeDollarSign>CondoBets
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" /> Dashboard
              </Link>
              <Link
                to="/bets"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                <ListPlus className="h-5 w-5 mr-2" /> Apostas
              </Link>
              <Link
                to="/calculator"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                <Calculator className="h-5 w-5 mr-2" /> Calculadora
              </Link>
            </div>
            {/* Botão de Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut className="h-5 w-5 mr-2" /> Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 bg-white shadow-md rounded-lg mt-6">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="text-center py-4 text-gray-600 text-sm">
        <p>© 2025 Mr. Condo. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
