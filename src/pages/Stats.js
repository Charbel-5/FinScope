import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

function Stats() {
  // Dummy data for a 30-day month.
  // Each day has an income and an expense.
  const dailyData = [
    { date: '01', income: 80, expense: 50 },
    { date: '02', income: 120, expense: 30 },
    { date: '03', income: 60, expense: 70 },
    { date: '04', income: 90, expense: 60 },
    { date: '05', income: 100, expense: 40 },
    { date: '06', income: 200, expense: 20 },
    { date: '07', income: 50, expense: 85 },
    { date: '08', income: 140, expense: 60 },
    { date: '09', income: 180, expense: 40 },
    { date: '10', income: 80, expense: 70 },
    { date: '11', income: 300, expense: 150 },
    { date: '12', income: 100, expense: 100 },
    { date: '13', income: 130, expense: 55 },
    { date: '14', income: 90, expense: 75 },
    { date: '15', income: 250, expense: 100 },
    { date: '16', income: 200, expense: 200 },
    { date: '17', income: 110, expense: 60 },
    { date: '18', income: 170, expense: 80 },
    { date: '19', income: 120, expense: 40 },
    { date: '20', income: 220, expense: 50 },
    { date: '21', income: 100, expense: 100 },
    { date: '22', income: 160, expense: 40 },
    { date: '23', income: 90, expense: 90 },
    { date: '24', income: 200, expense: 110 },
    { date: '25', income: 80, expense: 30 },
    { date: '26', income: 110, expense: 70 },
    { date: '27', income: 140, expense: 65 },
    { date: '28', income: 60, expense: 60 },
    { date: '29', income: 200, expense: 100 },
    { date: '30', income: 100, expense: 80 },
  ];

  // Calculate totals
  const totalIncome = dailyData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = dailyData.reduce((sum, d) => sum + d.expense, 0);
  const netBalance = totalIncome - totalExpense;

  // Data for the pie chart
  const pieData = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Total Expense', value: totalExpense },
  ];
  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Stats</h2>
      <p>Total Income: {totalIncome}</p>
      <p>Total Expense: {totalExpense}</p>
      <p>Net Balance: {netBalance}</p>

      <h3>Daily Income/Expense (Bar Chart)</h3>
      <BarChart width={600} height={300} data={dailyData} margin={{ top: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" label={{ value: 'Day', position: 'insideBottom' }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#82ca9d" />
        <Bar dataKey="expense" fill="#8884d8" />
      </BarChart>

      <h3>Totals (Pie Chart)</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default Stats;