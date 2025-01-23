import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTransactions } from '../context/TransactionsContext';
import { transformMonthTransactionsToDailyData } from '../Services/TransactionsData';
import MonthlySwitcher from '../components/MonthlySwitcher';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Stats.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

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
  const [primaryCurrencySymbol, setPrimaryCurrencySymbol] = useState('');
  const [conversionRates, setConversionRates] = useState([]);
  const { user } = useAuth();
  const stockData = transformAllTransactionsForStockChart(transactions);

  // Fetch currency info and conversion rates
  useEffect(() => {
    async function fetchCurrencyInfo() {
      if (!user?.userId) return;
      const [userAttrs, ratesRes] = await Promise.all([
        axios.get(`/api/complex/userAttributes/${user.userId}`),
        axios.get(`/api/currency_rates/${user.userId}`)
      ]);
      setPrimaryCurrencySymbol(userAttrs.data.primary_currency_symbol);
      setConversionRates(ratesRes.data);
    }
    fetchCurrencyInfo();
  }, [user?.userId]);

  // Helper function to get conversion rate for a date
  const getConversionRate = (transactionDate) => {
    if (!conversionRates.length) return 1;
    
    // Find the rate effective on or before the transaction date
    const applicableRate = conversionRates
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      .find(rate => new Date(rate.start_date) <= new Date(transactionDate));
    
    return applicableRate ? applicableRate.conversion_rate : 1;
  };

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

  // Calculate totals with historical conversion rates
  const monthlyTransactions = currentGroup.transactions || [];
  
  const totalIncome = monthlyTransactions
    .filter(t => t.transaction_type === 'Income')
    .reduce((sum, t) => {
      const amount = parseFloat(t.transaction_amount) || 0;
      const rate = t.currency_symbol === primaryCurrencySymbol 
        ? 1 
        : getConversionRate(t.transaction_date);
      const convertedAmount = amount * rate;
      return sum + (isNaN(convertedAmount) ? 0 : convertedAmount);
    }, 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.transaction_type === 'Expense')
    .reduce((sum, t) => {
      const amount = parseFloat(t.transaction_amount) || 0;
      const rate = t.currency_symbol === primaryCurrencySymbol 
        ? 1 
        : getConversionRate(t.transaction_date);
      const convertedAmount = amount * rate;
      return sum + (isNaN(convertedAmount) ? 0 : convertedAmount);
    }, 0);

  const netBalance = totalIncome - totalExpense;

  // Fix pie chart data preparation
  const expenseCategoryData = monthlyTransactions
    .filter(t => t.transaction_type === 'Expense' && t.transaction_category)
    .reduce((acc, t) => {
      const amount = parseFloat(t.transaction_amount) || 0;
      const rate = t.currency_symbol === primaryCurrencySymbol 
        ? 1 
        : getConversionRate(t.transaction_date);
      const convertedAmount = amount * rate;
      
      const category = t.transaction_category;
      acc[category] = (acc[category] || 0) + convertedAmount;
      return acc;
    }, {});

  const incomeCategoryData = monthlyTransactions
    .filter(t => t.transaction_type === 'Income' && t.transaction_category)
    .reduce((acc, t) => {
      const amount = parseFloat(t.transaction_amount) || 0;
      const rate = t.currency_symbol === primaryCurrencySymbol 
        ? 1 
        : getConversionRate(t.transaction_date);
      const convertedAmount = amount * rate;
      
      const category = t.transaction_category;
      acc[category] = (acc[category] || 0) + convertedAmount;
      return acc;
    }, {});

  const expensePieData = Object.entries(expenseCategoryData)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }))
    .filter(item => !isNaN(item.value) && item.value > 0);

  const incomePieData = Object.entries(incomeCategoryData)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }))
    .filter(item => !isNaN(item.value) && item.value > 0);

  // Add debug logging
  console.log('Monthly transactions:', monthlyTransactions);
  console.log('Category data:', expenseCategoryData);
  console.log('Pie data:', expensePieData);

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
        <div className='stats-income'>
          Monthly Income: {totalIncome.toFixed(2)} {primaryCurrencySymbol}
        </div>
        <div className='stats-expense'>
          Monthly Expense: {totalExpense.toFixed(2)} {primaryCurrencySymbol}
        </div>
        <div className={`${netBalance >= 0 ? 'stats-income' : 'stats-expense'}`}>
          Net Balance: {netBalance.toFixed(2)} {primaryCurrencySymbol}
        </div>
      </div>
      
    </div>
    
    
    <div className='stats-page spacer'>


    <div>



    <div>
      <h3>Expense Categories</h3>
      {expensePieData.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={expensePieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {expensePieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div>No expense data available</div>
      )}
    </div>

    <div>
      <h3>Income Categories</h3>
      {incomePieData.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={incomePieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#82ca9d"
            label
          >
            {incomePieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div>No income data available</div>
      )}
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