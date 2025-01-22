import { useState, useEffect } from 'react';
import './Settings.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { user } = useAuth();
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    mainCurrencyName: '',
    secondaryCurrencyName: '',
    conversionRate: '',
    email: '',
    password: '',
    username: ''
  });
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!user?.userId) return;

      try {
        // Get currencies
        const currenciesRes = await axios.get('/api/currencies');
        setAllCurrencies(currenciesRes.data.map(c => ({
          name: c.currency_name,
          symbol: c.symbol
        })));

        // Get user details
        const userRes = await axios.get(`/api/users/${user.userId}`);
        const userData = userRes.data;

        // Get user attributes and latest rate
        const userAttrsRes = await axios.get(`/api/complex/userAttributes/${user.userId}`);
        const userAttrs = userAttrsRes.data;

        // Set form data with all current values
        const currentData = {
          mainCurrencyName: userAttrs.primary_currency,
          secondaryCurrencyName: userAttrs.secondary_currency,
          conversionRate: userAttrs.latest_rate?.toString() || '1.00',
          email: userData.email,
          password: '********', // Placeholder for password
          username: userData.user_name
        };

        setFormData(currentData);
        setInitialData(currentData);

      } catch (err) {
        console.error('Error fetching settings data:', err);
      }
    }

    fetchData();
  }, [user?.userId]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const currencyName = value.split(' (')[0];
    
    const confirmed = window.confirm(
      'Changing currencies will erase all your data. Do you want to continue?'
    );
    
    if (confirmed) {
      setFormData(prev => ({
        ...prev,
        [name === 'mainCurrency' ? 'mainCurrencyName' : 'secondaryCurrencyName']: currencyName
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const currencyChanged = formData.mainCurrencyName !== initialData.mainCurrencyName || 
                           formData.secondaryCurrencyName !== initialData.secondaryCurrencyName;
    
    const credentialsChanged = formData.email !== initialData.email ||
                              formData.password !== '********' ||
                              formData.username !== initialData.username;

    try {
      if (currencyChanged) {
        const confirmed = window.confirm(
          'Changing currencies will erase all your transactions, accounts, and other data. Are you sure?'
        );
        if (!confirmed) return;

        await axios.put(`/api/complex/userCurrencies/${user.userId}`, {
          primary_currency_name: formData.mainCurrencyName,
          secondary_currency_name: formData.secondaryCurrencyName
        });
      }

      if (credentialsChanged) {
        const credentials = {};
        if (formData.email !== initialData.email) credentials.email = formData.email;
        if (formData.username !== initialData.username) credentials.user_name = formData.username;
        if (formData.password !== '********') credentials.password = formData.password;

        if (Object.keys(credentials).length > 0) {
          await axios.put(`/api/users/${user.userId}`, credentials);
        }
      }

      if (formData.conversionRate !== initialData.conversionRate) {
        await axios.post('/api/currency_rates', {
          conversion_rate: parseFloat(formData.conversionRate),
          start_date: new Date().toISOString().split('T')[0],
          user_id: user.userId
        });
      }

      setInitialData({
        ...formData,
        password: '********'
      });
      setFormData(prev => ({ ...prev, password: '********' }));

      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert(`Error saving settings: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form onSubmit={handleSave}>
        <div className="settings-group">
          <label>Main Currency</label>
          <select 
            name="mainCurrency" 
            value={formData.mainCurrencyName} 
            onChange={handleCurrencyChange}
          >
            {allCurrencies.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="settings-group">
          <label>Secondary Currency</label>
          <select 
            name="secondaryCurrency" 
            value={formData.secondaryCurrencyName}
            onChange={handleCurrencyChange}
          >
            {allCurrencies.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="settings-group">
          <label>Conversion Rate</label>
          <input
            type="number"
            step="0.000001"
            name="conversionRate"
            value={formData.conversionRate}
            onChange={handleFieldChange}
          />
        </div>

        <div className="settings-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFieldChange}
          />
        </div>

        <div className="settings-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFieldChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div className="settings-group">
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleFieldChange}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Settings;