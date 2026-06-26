const KEYS = {
  TOKEN: '@watchandsave:token',
  USER: '@watchandsave:user',
} as const;

function getStorage(): Storage | null {
  try {
    return localStorage;
  } catch {
    return null;
  }
}

export const storage = {
  getToken: (): string | null => {
    const storage = getStorage();
    if (!storage) return null;
    return storage.getItem(KEYS.TOKEN);
  },

  setToken: (token: string) => {
    const storage = getStorage();
    if (storage) storage.setItem(KEYS.TOKEN, token);
  },

  removeToken: () => {
    const storage = getStorage();
    if (storage) storage.removeItem(KEYS.TOKEN);
  },

  getUser: <T = unknown>(): T | null => {
    const storage = getStorage();
    if (!storage) return null;
    const raw = storage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },

  setUser: (user: unknown) => {
    const storage = getStorage();
    if (storage) storage.setItem(KEYS.USER, JSON.stringify(user));
  },

  removeUser: () => {
    const storage = getStorage();
    if (storage) storage.removeItem(KEYS.USER);
  },

  clear: () => {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(KEYS.TOKEN);
      storage.removeItem(KEYS.USER);
    }
  },
};
