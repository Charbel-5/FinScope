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

  const totalPieData = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Total Expense', value: totalExpense }
  ].filter(item => !isNaN(item.value) && item.value > 0);

  // Add debug logging
  console.log('Monthly transactions:', monthlyTransactions);
  console.log('Category data:', expenseCategoryData);
  console.log('Pie data:', expensePieData);

  return (
    <div className="stats-container">
      <div className="monthly-overview">
        <MonthlySwitcher
          displayMonthYear={availableMonths[currentIndex] || ''}
          onPrevious={handlePrevious}
          onNext={handleNext}
          availableMonths={availableMonths}
          onSelectMonth={handleSelectMonth}
        />

        <div className="statistics">
          <div className="stat-card stats-income">
            <h4>Monthly Income</h4>
            <div>{totalIncome.toFixed(2)} {primaryCurrencySymbol}</div>
          </div>
          <div className="stat-card stats-expense">
            <h4>Monthly Expense</h4>
            <div>{totalExpense.toFixed(2)} {primaryCurrencySymbol}</div>
          </div>
          <div className={`stat-card ${netBalance >= 0 ? 'stats-income' : 'stats-expense'}`}>
            <h4>Net Balance</h4>
            <div>{netBalance.toFixed(2)} {primaryCurrencySymbol}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="pie-charts-column">
          <div className="chart-container pie-chart-container">
            <h3>Expense Categories</h3>
            {expensePieData.length > 0 ? (
              <div className="responsive-chart">
                <PieChart width={300} height={300}>
                  <Pie
                    data={expensePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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
              </div>
            ) : (
              <div>No expense data available</div>
            )}
          </div>

          <div className="chart-container pie-chart-container">
            <h3>Income Categories</h3>
            {incomePieData.length > 0 ? (
              <div className="responsive-chart">
                <PieChart width={300} height={300}>
                  <Pie
                    data={incomePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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
              </div>
            ) : (
              <div>No income data available</div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>Daily Income/Expense</h3>
          <div className="responsive-chart">
            <BarChart width={500} height={300} data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expense" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        <div className="chart-container">
          <h3>Balance Trend</h3>
          <div className="responsive-chart">
            <LineChart width={500} height={300} data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>

        <div className="pie-chart-container">
          <h3>Monthly Total Distribution</h3>
          {totalPieData.length > 0 ? (
            <div className="responsive-chart">
              <PieChart width={400} height={300}>
                <Pie
                  data={totalPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#82ca9d" /> {/* Income color */}
                  <Cell fill="#8884d8" /> {/* Expense color */}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)} ${primaryCurrencySymbol}`} />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <div>No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stats;