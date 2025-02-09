import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

type Period = '7d' | '30d' | 'all';

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>('7d');
  const [stats, setStats] = useState({
    totalBets: 0,
    totalProfit: 0,
    greenRate: 0,
    avgOdd: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [period]);

  async function fetchStats() {
    let query = supabase.from('bets').select('*');

    if (period !== 'all') {
      const daysAgo = period === '7d' ? 7 : 30;
      const startDate = startOfDay(subDays(new Date(), daysAgo));
      query = query.gte('date', format(startDate, 'yyyy-MM-dd'));
    }

    const { data: bets, error } = await query;

    if (error) {
      console.error('Error fetching stats:', error);
      return;
    }

    if (bets) {
      const totalBets = bets.length;
      const totalBetsMade = bets.filter((bet) => bet.status === 'green' || bet.status === 'mafia').length;
      const totalProfit = bets.reduce((sum, bet) => sum + (bet.result || 0), 0);
      const greenBets = bets.filter((bet) => bet.status === 'green').length;
      const greenRate = totalBets > 0 ? (greenBets / totalBetsMade) * 100 : 0;
      const avgOdd =
        bets.length > 0
          ? bets.reduce((sum, bet) => sum + bet.odd, 0) / bets.length
          : 0;

      setStats({
        totalBets,
        totalProfit,
        greenRate,
        avgOdd,
      });
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="mt-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="all">Todo período</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Total de Apostas</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalBets}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Lucro Total</h3>
          <p className={`mt-2 text-3xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {stats.totalProfit.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Taxa de Green</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.greenRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Odd Média</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.avgOdd.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
