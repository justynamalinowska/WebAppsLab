// src/Api.ts
export const API_ROOT = 'http://localhost:5000/api';

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  // Dodaj header Authorization, jeśli mamy token
  options.headers = {
    ...(options.headers as object),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  // Pierwszy request
  let res = await fetch(`${API_ROOT}${path}`, options);

  // Jeśli dostałeś 401 i masz refreshToken — spróbuj odświeżyć
  if (res.status === 401 && refreshToken) {
    const r = await fetch(`${API_ROOT}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!r.ok) {
      // Nie udało się odświeżyć → wyloguj
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return res;
    }

    // Mamy nowy tokeny
    const data = await r.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Powtórz oryginalne zapytanie z nowym tokenem
    options.headers = {
      ...(options.headers as object),
      Authorization: `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    };
    res = await fetch(`${API_ROOT}${path}`, options);
  }

  return res;
}

// Przykładowa ekspozycja metod API:
export default {
  getProjects: () => fetchWithAuth('/projects').then(r => r.json()),
  addTask: (t: any) =>
    fetchWithAuth('/tasks', {
      method: 'POST',
      body: JSON.stringify(t),
    }).then(r => r.json()),
};

