import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../data/database';

const sqliteStorage = {
  getItem: (name: string): string | null => {
    try {
      const result = db.getFirstSync<{ value: string }>('SELECT value FROM settings WHERE key = ?', [name]);
      return result ? result.value : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [name, value]);
    } catch (e) {
      console.error('Failed to save to SQLite storage', e);
    }
  },
  removeItem: (name: string): void => {
    try {
      db.runSync('DELETE FROM settings WHERE key = ?', [name]);
    } catch (e) {
      console.error('Failed to remove from SQLite storage', e);
    }
  },
};

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: true, // default to true as per current design
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setTheme: (isDark) => set({ isDarkMode: isDark }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
);
