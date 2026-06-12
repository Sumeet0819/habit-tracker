package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val description: String = "",
    val category: String = "Personal",
    val priority: Int = 1, // 1: Low, 2: Medium, 3: High
    val startTime: Long, // timestamp
    val endTime: Long, // timestamp
    val completed: Boolean = false,
    val date: Long // For easier daily querying
)
