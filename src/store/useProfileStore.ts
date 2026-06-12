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

export interface ProfileState {
  name: string;
  email: string;
  avatarUri: string;
  age: string;
  height: string;
  weight: string;
  updateProfile: (data: Partial<Omit<ProfileState, 'updateProfile'>>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'Omoakin',
      email: 'omoakin@example.com',
      avatarUri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      age: '24',
      height: '178 cm',
      weight: '75 kg',
      updateProfile: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
);
