package com.example.ui

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object DateUtils {
    fun formatTime(timestamp: Long): String {
        return SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date(timestamp))
    }
    
    fun formatWeekday(timestamp: Long): String {
        return SimpleDateFormat("EEE", Locale.getDefault()).format(Date(timestamp))
    }
    
    fun formatDay(timestamp: Long): String {
        return SimpleDateFormat("dd", Locale.getDefault()).format(Date(timestamp))
    }
}
