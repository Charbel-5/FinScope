import { useState, useEffect } from 'react';
import './Settings.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AlertModal } from '../components/AlertModal';

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [showCurrencyConfirm, setShowCurrencyConfirm] = useState(false);
  const [pendingCurrencyChange, setPendingCurrencyChange] = useState(null);
  const [errors, setErrors] = useState({});

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


  const handleExport = async () => {
    try {
      const response = await axios.get(`/api/exportUserData/${user.userId}`, {
        responseType: 'blob'  // Important for handling file downloads
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_data.xlsx'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when field changes
    if (name === 'email') {
      const emailError = validateEmail(value);
      setErrors(prev => ({
        ...prev,
        email: emailError
      }));
    }
    
    if (name === 'password') {
      const passwordError = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordError
      }));
    }
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const currencyName = value.split(' (')[0];
    
    setShowCurrencyConfirm(true);
    setPendingCurrencyChange({
      field: name === 'mainCurrency' ? 'mainCurrencyName' : 'secondaryCurrencyName',
      value: currencyName
    });
  };

  const validatePassword = (password) => {
    if (password === '********') return '';
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must include at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must include at least one number';
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    const newErrors = {
      email: emailError,
      password: passwordError
    };
    
    setErrors(newErrors);
    
    if (emailError || passwordError) {
      return;
    }
    
    try {
      const currenciesChanged = 
        formData.mainCurrencyName !== initialData.mainCurrencyName || 
        formData.secondaryCurrencyName !== initialData.secondaryCurrencyName;

      if (currenciesChanged) {
        setShowCurrencyConfirm(true);
        setPendingCurrencyChange({ type: 'save' });
        return;
      }

      await saveChanges();
    } catch (err) {
      setAlertMessage(`Error saving settings: ${err.response?.data?.error || err.message}`);
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const saveChanges = async () => {
    try {
      const currenciesChanged = 
        formData.mainCurrencyName !== initialData.mainCurrencyName || 
        formData.secondaryCurrencyName !== initialData.secondaryCurrencyName;

      if (currenciesChanged) {
        await axios.put(`/api/complex/userCurrencies/${user.userId}`, {
          primary_currency_name: formData.mainCurrencyName,
          secondary_currency_name: formData.secondaryCurrencyName,
          conversion_rate: parseFloat(formData.conversionRate) // Add this line
        });
      }

      const credentialsChanged = formData.email !== initialData.email ||
                                formData.password !== '********' ||
                                formData.username !== initialData.username;

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

      setAlertMessage('Settings saved successfully!');
      setAlertType('success');
      setShowAlert(true);
    } catch (err) {
      setAlertMessage(`Error saving settings: ${err.response?.data?.error || err.message}`);
      setAlertType('error'); 
      setShowAlert(true);
    }
  };

  const handleCurrencyConfirm = (confirmed) => {
    setShowCurrencyConfirm(false);
    
    if (confirmed) {
      // Only update form state, no database changes yet
      setFormData(prev => ({
        ...prev,
        [pendingCurrencyChange.field]: pendingCurrencyChange.value
      }));
    }
    setPendingCurrencyChange(null);
  };

  const handleSaveConfirm = async (confirmed) => {
    setShowCurrencyConfirm(false);
    
    if (confirmed) {
      await saveChanges();
    }
    setPendingCurrencyChange(null);
  };

  return (
    <>
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
            {errors.email && <span className="error-message">{errors.email}</span>}
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
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="settings-group">
            <label>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleFieldChange}
            />
          </div>

           <button type="button" onClick={handleExport}>Export Data</button>

          <button type="submit">Save</button>
        </form>
      </div>
      
      {showAlert && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

      {showCurrencyConfirm && (
        <AlertModal
          message={
            pendingCurrencyChange?.type === 'save' 
              ? "Changing currencies will erase all your transactions, accounts, and other data. Are you sure you want to continue?"
              : "Changing currencies will erase all your transactions, accounts, and other data. Are you sure you want to continue?"
          }
          type="warning"
          onClose={() => pendingCurrencyChange?.type === 'save' 
            ? handleSaveConfirm(false)
            : handleCurrencyConfirm(false)}
          onConfirm={() => pendingCurrencyChange?.type === 'save'
            ? handleSaveConfirm(true) 
            : handleCurrencyConfirm(true)}
          showConfirmButton={true}
        />
      )}
    </>
  );
}

export default Settings;