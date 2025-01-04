import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTransactions } from '../context/TransactionsContext';
import { transformMonthTransactionsToDailyData } from '../Services/TransactionsData';
import MonthlySwitcher from '../components/MonthlySwitcher';


function transformAllTransactionsForStockChart(allTransactions) {
  let running = 0;
  const sorted = [...allTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted.map(txn => {
    if (txn.type === 'income') running += parseFloat(txn.amount);
    else if (txn.type === 'expense') running -= parseFloat(txn.amount);
    return { date: txn.date, close: running };
  });
}

function Stats() {
  const { transactionsGrouped, availableMonths, transactions } = useTransactions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const stockData = transformAllTransactionsForStockChart(transactions);


  // Navigation
  const handlePrevious = () => {
    if (currentIndex < transactionsGrouped.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handleNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleSelectMonth = (index) => setCurrentIndex(index);

  // Get daily data for the current month
  const currentGroup = transactionsGrouped[currentIndex] || {};
  const dailyData = transformMonthTransactionsToDailyData(currentGroup.transactions || []);

  // Calculate totals
  const totalIncome = dailyData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = dailyData.reduce((sum, d) => sum + d.expense, 0);
  const netBalance = totalIncome - totalExpense;

  // Prepare pie chart data
  const pieData = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Total Expense', value: totalExpense },
  ];
  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div style={{ padding: '20px' }}>
      <MonthlySwitcher
        displayMonthYear={
          availableMonths[currentIndex] || ''
        }
        onPrevious={handlePrevious}
        onNext={handleNext}
        availableMonths={availableMonths}
        onSelectMonth={handleSelectMonth}
      />

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
        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3>Line Chart</h3>
      <LineChart width={600} height={300} data={stockData} margin={{ top: 30, right: 30, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}

export default Stats;