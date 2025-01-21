import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTransactions } from '../context/TransactionsContext';
import { transformMonthTransactionsToDailyData } from '../Services/TransactionsData';
import MonthlySwitcher from '../components/MonthlySwitcher';
import './Stats.css';


function transformAllTransactionsForStockChart(allTransactions) {
  let running = 0;
  const sorted = [...allTransactions].sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
  return sorted.map(txn => {
    // Use the correct fields from transaction data
    if (txn.transaction_type === 'Income') {
      running += parseFloat(txn.transaction_amount);
    } else if (txn.transaction_type === 'Expense') {
      running -= parseFloat(txn.transaction_amount); 
    }
    return { 
      date: txn.transaction_date,
      close: running 
    };
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

  // Calculate totals from the transactions directly
  const monthlyTransactions = currentGroup.transactions || [];
  const totalIncome = monthlyTransactions
    .filter(t => t.transaction_type === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.transaction_type === 'Expense')
    .reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Prepare pie chart data
  const pieData = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Total Expense', value: totalExpense },
  ];
  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div>
      <MonthlySwitcher
        displayMonthYear={
          availableMonths[currentIndex] || ''
        }
        onPrevious={handlePrevious}
        onNext={handleNext}
        availableMonths={availableMonths}
        onSelectMonth={handleSelectMonth}
      />

    <div className='spacer'>
      <div className='statistics'>
        <div className='stats-income'>Monthly Income: {totalIncome}</div>
        <div className='stats-expense'>Monthly Expense: {totalExpense}</div>
        <div className={`${ netBalance > 0 ? 'stats-income' : 'stats-expense'}`}>Net Balance: {netBalance}</div>
      </div>
      
    </div>
    
    
    <div className='stats-page spacer'>


    <div>



    <div>
      <h3>Totals (Pie Chart)</h3>
      <PieChart width={400} height={300}>
        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>

    </div>
        
          

          <div>
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
          </div>

      
     

      <div className='spacer line-chart'>
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
    </div>
      
  </div>

      
  );
}

export default Stats;