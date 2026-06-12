import { Task, TaskRepository } from '../data/repositories/TaskRepository';
import { NotificationService } from './NotificationService';

class TaskServiceClass {
  getTasksForDate(date: number): Task[] {
    return TaskRepository.getTasksByDate(date);
  }

  // Returns tasks grouped by date for the 7-week view
  getTasksForNext7Weeks(startDate: number): Task[] {
    const SEVEN_WEEKS_MS = 7 * 7 * 24 * 60 * 60 * 1000;
    const endDate = startDate + SEVEN_WEEKS_MS;
    return TaskRepository.getTasksBetweenDates(startDate, endDate);
  }

  async createTask(taskData: Omit<Task, 'id' | 'notificationId'>): Promise<number> {
    let notificationId: string | undefined = undefined;

    if (taskData.hasReminder) {
      notificationId = await NotificationService.scheduleTaskReminder(
        taskData.title,
        `It's time for: ${taskData.title}`,
        taskData.startTime
      );
    }

    return TaskRepository.addTask({
      ...taskData,
      notificationId,
    });
  }

  async updateTask(task: Task): Promise<void> {
    // Check if we need to update/cancel the notification
    const oldTasks = TaskRepository.getTasksByDate(task.date);
    const oldTask = oldTasks.find((t) => t.id === task.id);

    let newNotificationId = task.notificationId;

    if (oldTask) {
      // If time changed, or reminder toggled off, cancel the old one
      if (oldTask.notificationId && (!task.hasReminder || oldTask.startTime !== task.startTime)) {
        await NotificationService.cancelNotification(oldTask.notificationId);
        newNotificationId = undefined; // reset
      }

      // If we need a new reminder (toggled on, or time changed)
      if (task.hasReminder && (!oldTask.notificationId || oldTask.startTime !== task.startTime)) {
        newNotificationId = await NotificationService.scheduleTaskReminder(
          task.title,
          `It's time for: ${task.title}`,
          task.startTime
        );
      }
    }

    TaskRepository.updateTask({
      ...task,
      notificationId: newNotificationId,
    });
  }

  async deleteTask(id: number, date: number): Promise<void> {
    const tasks = TaskRepository.getTasksByDate(date);
    const task = tasks.find((t) => t.id === id);

    if (task?.notificationId) {
      await NotificationService.cancelNotification(task.notificationId);
    }

    TaskRepository.deleteTask(id);
  }

  toggleTaskCompletion(id: number, currentCompleted: boolean): void {
    TaskRepository.toggleTaskCompletion(id, currentCompleted);
  }

  // Analytics Helpers
  getAnalytics(date: number) {
    const tasks = this.getTasksForDate(date);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percentage,
      activeStreak: this.calculateCurrentStreak(), // Placeholder for full streak logic
    };
  }

  // A basic mock implementation for streaks. 
  // Real implementation would query the past N days to find consecutive 100% completion days.
  private calculateCurrentStreak(): number {
    return 14; // Hardcoded for dashboard design matching, will be dynamic in future iterations
  }
}

export const TaskService = new TaskServiceClass();
