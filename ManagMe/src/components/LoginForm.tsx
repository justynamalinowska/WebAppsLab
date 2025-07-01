import React, { useState } from 'react';
import './LoginForm.style.css'; 

const API_URL = 'http://localhost:5000/api/auth';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { token, refreshToken } = await res.json();
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      // przekieruj np. do “/”
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Logowanie</h2>

        <div className="form-group">
          <label htmlFor="username">Login</label>
          <input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Hasło</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary">
          Zaloguj
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
