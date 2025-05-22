export const API_ROOT = 'http://localhost:5000/api';

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  options.headers = {
    ...(options.headers as object),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  let res = await fetch(`${API_ROOT}${path}`, options);

  if (res.status === 401 && refreshToken) {
    const r = await fetch(`${API_ROOT}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!r.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return res;
    }

    const data = await r.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    options.headers = {
      ...(options.headers as object),
      Authorization: `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    };
    res = await fetch(`${API_ROOT}${path}`, options);
  }

  return res;
}

export default {
  getProjects: () => fetchWithAuth('/projects').then(r => r.json()),
  addTask: (t: any) =>
    fetchWithAuth('/tasks', {
      method: 'POST',
      body: JSON.stringify(t),
    }).then(r => r.json()),
};

