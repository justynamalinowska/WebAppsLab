import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import './index.css';

import Home from './components/Home';
import LoginForm from './components/LoginForm';

import { auth } from './components/Firebase';
import {
  onAuthStateChanged,
  getRedirectResult,
  signOut,
  User
} from 'firebase/auth';

const MainAppContent: React.FC = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const idToken = await result.user.getIdToken();
          const res = await fetch('http://localhost:5000/api/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken }),
          });
          if (res.ok) {
            const { token, refreshToken } = await res.json();
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            navigate('/', { replace: true });
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
      
    const unsub = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      setLoading(false);
    });
    return unsub;
  }, [navigate]);

  if (loading) return <div>Ładowanie…</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          localStorage.getItem('token') ? (
            <Navigate to="/" replace />
          ) : (
            <LoginForm />
          )
        }
      />

<Route
        path="/"
        element={
          localStorage.getItem('token') ? (
            <Home />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const MainApp: React.FC = () => (
  <StrictMode>
    <BrowserRouter>
      <MainAppContent />
    </BrowserRouter>
  </StrictMode>
);

const root = createRoot(document.getElementById('root')!);
root.render(<MainApp />);