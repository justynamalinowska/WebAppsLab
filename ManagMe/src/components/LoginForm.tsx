import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api/auth';
const GOOGLE_LOGIN_URL = 'http://localhost:5000/api/auth/google-login';

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
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Zaloguj</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <div style={{ marginTop: '1em', textAlign: 'center' }}>
        <button
          type="button"
          className="google-button"
          onClick={() => window.location.href = 'http://localhost:5000/api/auth/google-login'}
        >
          Zaloguj przez Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
