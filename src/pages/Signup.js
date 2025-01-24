import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Settings.css'; // Reuse settings styles

function Signup() {
  const { signup } = useAuth();
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    mainCurrencyName: '',
    secondaryCurrencyName: '',
    conversionRate: '1.00'
  });

  const [errors, setErrors] = useState({});

  // Fetch available currencies on component mount
  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await axios.get('/api/currencies');
        setAllCurrencies(response.data.map(c => ({
          name: c.currency_name,
          symbol: c.symbol
        })));
        // Set default currencies
        if (response.data.length >= 2) {
          setFormData(prev => ({
            ...prev,
            mainCurrencyName: response.data[0].currency_name,
            secondaryCurrencyName: response.data[1].currency_name
          }));
        }
      } catch (err) {
        console.error('Error fetching currencies:', err);
      }
    }
    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = (newErrors.password || '') + ' Include at least one uppercase letter';
    }
    if (!/[0-9]/.test(formData.password)) {
      newErrors.password = (newErrors.password || '') + ' Include at least one number';
    }

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    // Currency validation
    if (!formData.mainCurrencyName) {
      newErrors.mainCurrencyName = 'Please select a main currency';
    }
    if (!formData.secondaryCurrencyName) {
      newErrors.secondaryCurrencyName = 'Please select a secondary currency';
    }
    if (formData.mainCurrencyName === formData.secondaryCurrencyName) {
      newErrors.secondaryCurrencyName = 'Secondary currency must be different from main currency';
    }

    // Conversion rate validation
    const rate = parseFloat(formData.conversionRate);
    if (isNaN(rate) || rate <= 0) {
      newErrors.conversionRate = 'Please enter a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Get currency IDs from currency names
      const response = await axios.post('/api/register', {
        email: formData.email,
        password: formData.password,
        user_name: formData.username,
        primary_currency_name: formData.mainCurrencyName, 
        secondary_currency_name: formData.secondaryCurrencyName,
        conversion_rate: parseFloat(formData.conversionRate)
      });

      if (response.status === 201) {
        alert('Signup successful! You can now log in.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="settings-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="settings-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="settings-group">
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="settings-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="settings-group">
          <label>Main Currency</label>
          <select 
            name="mainCurrencyName" 
            value={formData.mainCurrencyName}
            onChange={handleChange}
            required
          >
            <option value="">Select Currency</option>
            {allCurrencies.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
          {errors.mainCurrencyName && <span className="error-message">{errors.mainCurrencyName}</span>}
        </div>

        <div className="settings-group">
          <label>Secondary Currency</label>
          <select
            name="secondaryCurrencyName"
            value={formData.secondaryCurrencyName}
            onChange={handleChange}
            required
          >
            <option value="">Select Currency</option>
            {allCurrencies.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
          {errors.secondaryCurrencyName && <span className="error-message">{errors.secondaryCurrencyName}</span>}
        </div>

        <div className="settings-group">
          <label>Conversion Rate</label>
          <input
            type="number"
            step="0.000001"
            name="conversionRate"
            value={formData.conversionRate}
            onChange={handleChange}
            required
          />
          {errors.conversionRate && <span className="error-message">{errors.conversionRate}</span>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;