import { create } from 'zustand';
import { Task } from '../data/repositories/TaskRepository';
import { TaskService } from '../services/TaskService';

interface TaskState {
  todayTasks: Task[];
  loadTasksForDate: (date: number) => void;
  toggleTaskComplete: (task: Task) => void;
  addNewTask: (task: Omit<Task, 'id' | 'notificationId'>) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  removeTask: (id: number, date: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  todayTasks: [],

  loadTasksForDate: (date: number) => {
    const tasks = TaskService.getTasksForDate(date);
    set({ todayTasks: tasks });
  },

  toggleTaskComplete: (task: Task) => {
    if (task.id === undefined) return;
    TaskService.toggleTaskCompletion(task.id, task.completed);
    // Reload tasks to reflect changes
    get().loadTasksForDate(task.date);
  },

  addNewTask: async (task) => {
    await TaskService.createTask(task);
    get().loadTasksForDate(task.date);
  },

  editTask: async (task) => {
    await TaskService.updateTask(task);
    get().loadTasksForDate(task.date);
  },

  removeTask: async (id: number, date: number) => {
    await TaskService.deleteTask(id, date);
    get().loadTasksForDate(date); 
  },
}));
