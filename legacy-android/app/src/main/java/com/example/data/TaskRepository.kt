package com.example.data

import kotlinx.coroutines.flow.Flow

class TaskRepository(private val taskDao: TaskDao) {
    val allTasks: Flow<List<Task>> = taskDao.getAllTasks()
    
    fun getTasksForDate(date: Long): Flow<List<Task>> = taskDao.getTasksForDate(date)

    suspend fun insert(task: Task) = taskDao.insertTask(task)
    
    suspend fun update(task: Task) = taskDao.updateTask(task)

    suspend fun deleteById(id: Int) = taskDao.deleteTaskById(id)
    
    val completedTaskCount: Flow<Int> = taskDao.getCompletedTaskCount()
    
    val totalTaskCount: Flow<Int> = taskDao.getTotalTaskCount()
}
