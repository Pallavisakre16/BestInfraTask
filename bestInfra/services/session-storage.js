const AUTH_STORAGE_KEY = 'bestinfra.auth';

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  return null;
}

export function loadStoredAuthState() {
  const storage = getStorage();

  if (!storage) {
    return { user: null, token: null };
  }

  try {
    const rawValue = storage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return { user: null, token: null };
    }

    const parsedValue = JSON.parse(rawValue);
    return {
      user: parsedValue.user || null,
      token: parsedValue.token || null,
    };
  } catch {
    return { user: null, token: null };
  }
}

export function persistAuthState(authState) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    if (!authState?.token) {
      storage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    storage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: authState.user || null,
        token: authState.token,
      })
    );
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY);
  }
}
