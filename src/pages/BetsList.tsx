import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Plus, Edit, Trash, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type Bet = {
  id: string;
  date: string;
  bookmaker: string;
  description: string;
  odd: number;
  amount: number;
  status: 'waiting' | 'green' | 'mafia' | 'canceled';
  result: number;
};

export default function BetsList() {
  const { session } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBet, setEditBet] = useState<Bet | null>(null);
  const [newBet, setNewBet] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    bookmaker: '',
    description: '',
    odd: '',
    amount: '',
  });

  useEffect(() => {
    fetchBets();
  }, []);

  async function fetchBets() {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching bets:', error);
    } else {
      setBets(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editBet) {
      // Update existing bet
      const { error } = await supabase
        .from('bets')
        .update({
          ...newBet,
          odd: Number(newBet.odd),
          amount: Number(newBet.amount),
        })
        .eq('id', editBet.id);

      if (error) {
        console.error('Error updating bet:', error);
      } else {
        setEditBet(null);
        setShowForm(false);
        setNewBet({
          date: format(new Date(), 'yyyy-MM-dd'),
          bookmaker: '',
          description: '',
          odd: '',
          amount: '',
        });
        fetchBets();
      }
    } else {
      // Create new bet
      const { error } = await supabase.from('bets').insert([
        {
          ...newBet,
          odd: Number(newBet.odd),
          amount: Number(newBet.amount),
          user_id: session?.user.id,
        },
      ]);

      if (error) {
        console.error('Error creating bet:', error);
      } else {
        setShowForm(false);
        setNewBet({
          date: format(new Date(), 'yyyy-MM-dd'),
          bookmaker: '',
          description: '',
          odd: '',
          amount: '',
        });
        fetchBets();
      }
    }
  }

  async function updateBetStatus(id: string, status: 'waiting' | 'green' | 'mafia' | 'canceled') {
    const bet = bets.find((b) => b.id === id);
    if (!bet) return;

    let result = 0;
    if (status === 'green') {
      result = bet.amount * (bet.odd - 1);
    } else if (status === 'mafia') {
      result = -bet.amount;
    } else {
      result = 0; // Zera o resultado para status 'canceled' ou 'waiting'
    }

    const { error } = await supabase
      .from('bets')
      .update({ status, result })
      .eq('id', id);

    if (error) {
      console.error('Error updating bet:', error);
    } else {
      fetchBets();
    }
  }

  async function deleteBet(id: string) {
    const { error } = await supabase.from('bets').delete().eq('id', id);

    if (error) {
      console.error('Error deleting bet:', error);
    } else {
      fetchBets();
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'mafia':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green':
        return <CheckCircle className="h-4 w-4" />;
      case 'mafia':
        return <XCircle className="h-4 w-4" />;
      case 'canceled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Apostas</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditBet(null);
            setNewBet({
              date: format(new Date(), 'yyyy-MM-dd'),
              bookmaker: '',
              description: '',
              odd: '',
              amount: '',
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Aposta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                value={newBet.date}
                onChange={(e) => setNewBet({ ...newBet, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Casa de Apostas</label>
              <input
                type="text"
                value={newBet.bookmaker}
                onChange={(e) => setNewBet({ ...newBet, bookmaker: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <input
                type="text"
                value={newBet.description}
                onChange={(e) => setNewBet({ ...newBet, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Odd (use ponto para decimais, ex: 1.75)
              </label>
              <input
                type="number"
                step="0.01"
                value={newBet.odd}
                onChange={(e) => setNewBet({ ...newBet, odd: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1"
                placeholder="Ex: 1.75"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor (use ponto para decimais, ex: 50.00)
              </label>
              <input
                type="number"
                step="0.01"
                value={newBet.amount}
                onChange={(e) => setNewBet({ ...newBet, amount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0.01"
                placeholder="Ex: 50.00"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditBet(null);
              }}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {editBet ? 'Salvar Alterações' : 'Criar Aposta'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Casa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Odd
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resultado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bets.map((bet) => (
              <tr key={bet.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(bet.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.bookmaker}</td>
                <td className="px-6 py-4">{bet.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.odd.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">R$ {bet.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        bet.status
                      )}`}
                    >
                      {getStatusIcon(bet.status)}
                      <select
                        value={bet.status}
                        onChange={(e) => updateBetStatus(bet.id, e.target.value as 'waiting' | 'green' | 'mafia' | 'canceled')}
                        className="block w-34 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      >
                        <option value="waiting">Aguardando</option>
                        <option value="green">Green</option>
                        <option value="mafia">Mafia</option>
                        <option value="canceled">Anulado</option>
                      </select>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bet.result ? `R$ ${bet.result.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditBet(bet);
                        setNewBet({
                          date: format(new Date(bet.date), 'yyyy-MM-dd'),
                          bookmaker: bet.bookmaker,
                          description: bet.description,
                          odd: bet.odd.toFixed(2),
                          amount: bet.amount.toFixed(2),
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteBet(bet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
