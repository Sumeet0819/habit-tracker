package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.Task
import com.example.ui.DateUtils
import com.example.ui.MainViewModel
import com.example.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun PlannerScreen(viewModel: MainViewModel) {
    val tasks by viewModel.todayTasks.collectAsStateWithLifecycle()
    
    // Header styling matching the screenshot PRD
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(top = 16.dp),
    ) {
        // Header Row
        Row(
            modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("HELLO THERE!", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Medium, letterSpacing = 1.sp)
                Text("Mark Parker", color = TextTitle, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(PrimaryColor),
                contentAlignment = Alignment.Center
            ) {
                Text("MP", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Text(
            "Check your\nschedule today",
            color = TextTitle,
            fontWeight = FontWeight.Bold,
            fontSize = 32.sp,
            lineHeight = 38.sp,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Days Row Container (Simplified)
        Row(
            modifier = Modifier.padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Timeline view with LazyColumn
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                if(tasks.isEmpty()) {
                    item { 
                        Text("No tasks scheduled for today.", color = TextMuted, modifier = Modifier.padding(vertical = 32.dp)) 
                    }
                }
                
                items(tasks) { task ->
                    TaskTimelineItem(task = task, onToggle = { viewModel.toggleTaskComplete(task) })
                }
            }
        }
    }
}

@Composable
fun TaskTimelineItem(task: Task, onToggle: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Date indicator column
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(40.dp)) {
            Text(DateUtils.formatDay(task.startTime), color = TextTitle, fontWeight = FontWeight.Bold, fontSize = 20.sp)
            Text(DateUtils.formatWeekday(task.startTime).uppercase(), color = TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
        
        // Task Card
        Card(
            modifier = Modifier.weight(1f).heightIn(min = 100.dp),
            colors = CardDefaults.cardColors(containerColor = if(task.completed) SurfaceVariantColor else SurfaceColor),
            border = BorderStroke(1.dp, BorderColor),
            shape = RoundedCornerShape(24.dp),
            onClick = onToggle
        ) {
            Row(modifier = Modifier.padding(16.dp).fillMaxSize(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(if(task.completed) SuccessColor else PrimaryColor))
                        Text(task.title, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text(task.category, color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    
                    if(task.completed) {
                        Text("Completed", color = SuccessColor, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Text(DateUtils.formatTime(task.startTime), color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
