// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Home from './components/Home';
import LoginForm from './components/LoginForm';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Strona logowania */}
        <Route path="/login" element={<LoginForm />} />

        {/* Główna aplikacja – chroniona */}
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Wszystko inne → 404 lub przekierowanie */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
