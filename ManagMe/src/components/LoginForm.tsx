import React, { useState } from 'react';
import './LoginForm.style.css';

import { auth, googleProvider } from '../components/Firebase';
import { signInWithRedirect } from 'firebase/auth';

const API_URL = 'http://localhost:5000/api/auth';
const GOOGLE_LOGIN_URL = `${API_URL}/google-login`;

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
        credentials: 'include',
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

  const handleGoogleFirebaseLogin = () => {
    signInWithRedirect(auth, googleProvider);
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

        <button
          type="button"
          className="btn google"
          onClick={() => (window.location.href = GOOGLE_LOGIN_URL)}
        >
          Zaloguj przez Google
        </button>

        <button
          type="button"
          className="btn firebase-google"
          onClick={handleGoogleFirebaseLogin}
        >
          Zaloguj przez Google z Firebase
        </button>
      </form>
    </div>
  );
};

export default LoginForm;