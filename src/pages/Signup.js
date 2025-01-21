import React, { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, user_name: userName })
      });
      if (!res.ok) {
        throw new Error('Signup failed');
      }
      // On success, direct user to login page or auto-login
      alert('Signup successful! You can now log in.');
    } catch (err) {
      console.error(err);
      alert('Signup error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div>
        <label>Email:</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>User Name:</label>
        <input value={userName} onChange={e => setUserName(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password"
               value={password}
               onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;