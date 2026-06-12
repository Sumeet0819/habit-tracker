import { db } from '../database';

export interface Task {
  id?: number;
  title: string;
  description: string;
  category: string;
  priority: number;
  startTime: number;
  endTime: number;
  completed: boolean;
  date: number;
  hasReminder: boolean;
  notificationId?: string;
}

class TaskRepositoryClass {
  // Get tasks for a specific date
  getTasksByDate(date: number): Task[] {
    const result = db.getAllSync<any>('SELECT * FROM tasks WHERE date = ? ORDER BY startTime ASC', [date]);
    return result.map(this.mapRowToTask);
  }

  // Get tasks between two dates (useful for 7-week calendar and analytics)
  getTasksBetweenDates(startDate: number, endDate: number): Task[] {
    const result = db.getAllSync<any>(
      'SELECT * FROM tasks WHERE date >= ? AND date <= ? ORDER BY date ASC, startTime ASC',
      [startDate, endDate]
    );
    return result.map(this.mapRowToTask);
  }

  // Add a new task
  addTask(task: Omit<Task, 'id'>): number {
    const result = db.runSync(
      'INSERT INTO tasks (title, description, category, priority, startTime, endTime, completed, date, hasReminder, notificationId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        task.title,
        task.description,
        task.category,
        task.priority,
        task.startTime,
        task.endTime,
        task.completed ? 1 : 0,
        task.date,
        task.hasReminder ? 1 : 0,
        task.notificationId || null,
      ]
    );
    return result.lastInsertRowId;
  }

  // Update a task
  updateTask(task: Task): void {
    if (!task.id) return;
    db.runSync(
      'UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, startTime = ?, endTime = ?, completed = ?, date = ?, hasReminder = ?, notificationId = ? WHERE id = ?',
      [
        task.title,
        task.description,
        task.category,
        task.priority,
        task.startTime,
        task.endTime,
        task.completed ? 1 : 0,
        task.date,
        task.hasReminder ? 1 : 0,
        task.notificationId || null,
        task.id,
      ]
    );
  }

  // Toggle completion specifically
  toggleTaskCompletion(id: number, currentCompleted: boolean): void {
    db.runSync('UPDATE tasks SET completed = ? WHERE id = ?', [currentCompleted ? 0 : 1, id]);
  }

  // Delete a task
  deleteTask(id: number): void {
    db.runSync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  // Helper to map DB rows back to TS types
  private mapRowToTask(row: any): Task {
    return {
      ...row,
      completed: row.completed === 1,
      hasReminder: row.hasReminder === 1,
    };
  }
}

export const TaskRepository = new TaskRepositoryClass();
