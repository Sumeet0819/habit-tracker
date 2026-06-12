import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('habits.db');

export const initDb = () => {
  // Create tasks table with new scheduling & notification fields
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'Personal',
      priority INTEGER DEFAULT 1,
      startTime INTEGER NOT NULL,
      endTime INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      date INTEGER NOT NULL,
      hasReminder INTEGER DEFAULT 0,
      notificationId TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Simple migration to add columns if they don't exist
  try {
    db.execSync('ALTER TABLE tasks ADD COLUMN hasReminder INTEGER DEFAULT 0;');
    db.execSync('ALTER TABLE tasks ADD COLUMN notificationId TEXT;');
  } catch (e) {
    // Columns already exist, safely ignore
  }
};
