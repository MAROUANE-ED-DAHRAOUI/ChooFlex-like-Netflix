/**
 * Local storage utility functions
 */

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

export const theme = {
  get: () => storage.get('theme', 'dark'),
  set: (theme) => {
    storage.set('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },
  toggle: () => {
    const current = theme.get();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    theme.set(newTheme);
    return newTheme;
  }
};

export const preferences = {
  get: () => storage.get('userPreferences', {
    language: 'en',
    autoPlay: true,
    notifications: {
      email: true,
      push: true,
      inApp: true
    },
    privacy: {
      profileVisibility: 'public',
      twoFactorAuth: false
    }
  }),
  
  set: (prefs) => storage.set('userPreferences', prefs),
  
  update: (key, value) => {
    const current = preferences.get();
    const updated = { ...current, [key]: value };
    preferences.set(updated);
    return updated;
  }
};
