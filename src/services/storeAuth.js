const STORE_SESSION_KEY = 'acai-store-auth';

function readAuth() {
  // Migra login antigo (sessionStorage não compartilha entre abas)
  if (localStorage.getItem(STORE_SESSION_KEY) === '1') return true;
  if (sessionStorage.getItem(STORE_SESSION_KEY) === '1') {
    localStorage.setItem(STORE_SESSION_KEY, '1');
    sessionStorage.removeItem(STORE_SESSION_KEY);
    return true;
  }
  return false;
}

export function isStoreLoggedIn() {
  return readAuth();
}

export function loginStore(password) {
  const expected = import.meta.env.VITE_STORE_PASSWORD || 'wagao123';
  if (password !== expected) {
    return { ok: false, error: 'Senha incorreta' };
  }
  localStorage.setItem(STORE_SESSION_KEY, '1');
  sessionStorage.removeItem(STORE_SESSION_KEY);
  return { ok: true };
}

export function logoutStore() {
  localStorage.removeItem(STORE_SESSION_KEY);
  sessionStorage.removeItem(STORE_SESSION_KEY);
}
