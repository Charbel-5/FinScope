// ...existing code...
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
 
function DebtCalculator() {
  const [interestRate, setInterestRate] = useState('');
  const [principal, setPrincipal] = useState('');
  const [periods, setPeriods] = useState('');
  const [interval, setInterval] = useState('');
  const [payment, setPayment] = useState(0);
  const [chartData, setChartData] = useState({});
 
  const calculatePayment = () => {
    const r = parseFloat(interestRate) / 100;
    const n = parseInt(periods, 10);
    if (r > 0 && n > 0) {
      const pmt = (r * principal) / (1 - Math.pow(1 + r, -n));
      setPayment(pmt.toFixed(2));
      buildChartData(pmt);
    }
  };
 
  const buildChartData = (pmt) => {
    const dataPoints = [];
    let remaining = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    for (let i = 0; i < periods; i++) {
      remaining = remaining * (1 + r) - pmt;
      dataPoints.push(remaining);
    }
    setChartData({
      labels: Array.from({ length: periods }, (_, i) => `Pay #${i + 1}`),
      datasets: [
        {
          label: 'Remaining Debt',
          data: dataPoints,
          borderColor: 'rgba(75,192,192,1)',
          fill: false
        }
      ]
    });
  };
 
  return (
    <div>
      <h2>Debt Calculator</h2>
      <div>
        <label>Interest Rate (%): </label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>
      <div>
        <label>Amount to Cover: </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
      </div>
      <div>
        <label>Number of Payments: </label>
        <input
          type="number"
          value={periods}
          onChange={(e) => setPeriods(e.target.value)}
        />
      </div>
      <button onClick={calculatePayment}>Compute Payment</button>
      <h3>Periodic Payment: {payment}</h3>
      {chartData.labels && <Line data={chartData} />}
    </div>
  );
}
 
export default DebtCalculator;