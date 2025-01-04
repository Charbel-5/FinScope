import { useState } from 'react';
import './Settings.css';

function Settings() {
  const allCurrencies = [
    { name: 'US Dollar', symbol: '$' },
    { name: 'Euro', symbol: '€' },
    { name: 'British Pound', symbol: '£' },
    { name: 'Japanese Yen', symbol: '¥' }
  ];

  const [formData, setFormData] = useState({
    mainCurrencyName: 'US Dollar',
    mainCurrencySymbol: '$',
    secondaryCurrencyName: 'Euro',
    secondaryCurrencySymbol: '€',
    conversionRate: '1.08',
    email: 'john@example.com',
    password: 'mypassword',
    username: 'johndoe',
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e) => {
    const { value, name } = e.target;
    if (window.confirm('Changing currency settings will erase all user data. Continue?')) {
      const selected = allCurrencies.find(c => c.name === value.split(' (')[0]);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          [`${name}Name`]: selected.name,
          [`${name}Symbol`]: selected.symbol
        }));
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure? This will erase all user data.')) {
      // Proceed with save
      alert('Settings saved and data erased!');
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form onSubmit={handleSave}>
        <div className="settings-group">
          <label>Main Currency</label>
          <select name="mainCurrency" value={`${formData.mainCurrencyName} (${formData.mainCurrencySymbol})`} onChange={handleCurrencyChange}>
            {allCurrencies.map((c, i) => (
              <option key={i} value={`${c.name} (${c.symbol})`}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="settings-group">
          <label>Secondary Currency</label>
          <select name="secondaryCurrency" value={`${formData.secondaryCurrencyName} (${formData.secondaryCurrencySymbol})`} onChange={handleCurrencyChange}>
            {allCurrencies.map((c, i) => (
              <option key={i} value={`${c.name} (${c.symbol})`}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="settings-group">
          <label>Conversion Rate</label>
          <input 
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