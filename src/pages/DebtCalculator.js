import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import './DebtCalculator.css';

// Add this default chart data at the start of the component
const defaultChartData = {
  labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
  datasets: [{
    label: 'Remaining Debt',
    data: Array(12).fill(0),
    borderColor: 'rgba(75,192,192,1)',
    fill: false,
    borderDash: [5, 5] // Add dashed line for empty state
  }]
};

function DebtCalculator() {
  const [interestRate, setInterestRate] = useState('');
  const [principal, setPrincipal] = useState('');
  const [periods, setPeriods] = useState('');
  const [payment, setPayment] = useState(0);
  const [chartData, setChartData] = useState(defaultChartData);

  const [nominalRate, setNominalRate] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState('daily');
  const [customFrequency, setCustomFrequency] = useState('');
  const [effectiveRate, setEffectiveRate] = useState(0);

  const calculateDebtPayment = () => {
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

  const computeEffectiveRate = () => {
    const annualNominal = parseFloat(nominalRate) / 100;
    let freq = 0;
    switch (compoundingFrequency) {
      case 'daily':
        freq = 365;
        break;
      case 'weekly':
        freq = 52;
        break;
      case 'monthly':
        freq = 12;
        break;
      case 'quarterly':
        freq = 4;
        break;
      case 'custom':
        freq = parseFloat(customFrequency) || 1;
        break;
      default:
        freq = 1;
    }
    if (annualNominal > 0 && freq > 0) {
      const effRate = Math.pow(annualNominal + 1, 1 / freq) - 1;
      setEffectiveRate((effRate * 100).toFixed(5));
    }
  };

  return (
    <div className="calculator-container debt-calculator-page">
      <div className="chart-container">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }}
        />
      </div>
      <div className="calculator-sections">
        <div className="debt-calculator">
          <h2>Debt Calculator</h2>
          <table className="debt-calculator-table">
            <tr>
              <td className="debt-calculator-cell debt-calculator-label-cell">
                <label>Annual Interest Rate (%):</label>
              </td>
              <td className="debt-calculator-cell">
                <input
                  className="debt-calculator-input"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="debt-calculator-cell debt-calculator-label-cell">
                <label>Principal: </label>
              </td>
              <td className="debt-calculator-cell">
                <input
                  className="debt-calculator-input"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="debt-calculator-cell debt-calculator-label-cell">
                <label>Total Payments: </label>
              </td>
              <td className="debt-calculator-cell">
                <input
                  className="debt-calculator-input"
                  type="number"
                  value={periods}
                  onChange={(e) => setPeriods(e.target.value)}
                />
              </td>
            </tr>
          </table>
          <button className="debt-calculator-button" onClick={calculateDebtPayment}>
            Compute Payment
          </button>
          <h3 className="debt-calculator-result">Periodic Payment: {payment}</h3>
        </div>
        <div className="rate-calculator">
          <h2>Effective Interest Rate Calculator</h2>
          <table className="rate-calculator-table">
            <tr>
              <td className="rate-calculator-cell rate-calculator-label-cell">
                <label>Nominal Annual Rate (%): </label>
              </td>
              <td className="rate-calculator-cell">
                <input
                  className="rate-calculator-input"
                  type="number"
                  value={nominalRate}
                  onChange={(e) => setNominalRate(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="rate-calculator-cell rate-calculator-label-cell">
                <label>Compounding Frequency:</label>
              </td>
              <td className="rate-calculator-cell">
                <select
                  className="rate-calculator-select"
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="custom">Custom</option>
                </select>
                {compoundingFrequency === 'custom' && (
                  <input
                    className="rate-calculator-input"
                    type="number"
                    placeholder="Times per year"
                    value={customFrequency}
                    onChange={(e) => setCustomFrequency(e.target.value)}
                  />
                )}
              </td>
            </tr>
          </table>
          <button className="rate-calculator-button" onClick={computeEffectiveRate}>
            Compute Effective Rate
          </button>
          <h3 className="rate-calculator-result">Effective Rate: {effectiveRate}%</h3>
        </div> 
      </div>
    </div>
  );
}

export default DebtCalculator;