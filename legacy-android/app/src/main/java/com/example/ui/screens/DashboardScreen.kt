package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.MainViewModel
import com.example.ui.theme.*

@Composable
fun DashboardScreen(viewModel: MainViewModel) {
    val totalTasks by viewModel.totalTasks.collectAsStateWithLifecycle()
    val completedTasks by viewModel.totalCompleted.collectAsStateWithLifecycle()
    
    val completionPercent = if(totalTasks > 0) (completedTasks.toFloat() / totalTasks) else 0f

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // App Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp, bottom = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("7 WEEK HABIT", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Medium, letterSpacing = 1.sp)
                Text("Morning Momentum", color = TextTitle, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(PrimaryColor),
                contentAlignment = Alignment.Center
            ) {
                Text("JD", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }

        // Top Cards Row
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            // First Card - Styled as Bento "Hero"
            Card(
                colors = CardDefaults.cardColors(containerColor = PrimaryColor),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.weight(1f).aspectRatio(0.9f)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp).fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Workout\nPlan", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                    
                    Box(
                        modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(16.dp)).background(Color.White.copy(alpha=0.2f)).padding(12.dp)
                    ) {
                        Text("Morning walk\n6:30 am", color = Color.White, fontSize = 12.sp)
                    }
                }
            }

            // Second Card - Styled as Secondary Bento Card
            Card(
                colors = CardDefaults.cardColors(containerColor = SurfaceColor),
                border = BorderStroke(1.dp, BorderColor),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.weight(1f).aspectRatio(0.9f)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp).fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("15TH MAY", color = TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Start\nDaily\nCardio", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                    Button(
                        onClick = {},
                        colors = ButtonDefaults.buttonColors(containerColor = TextPrimary, contentColor = BackgroundColor),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth(),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text("Start", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }

        // Progress Tracking Card - Bento Full Span
        Card(
            colors = CardDefaults.cardColors(containerColor = SurfaceColor),
            border = BorderStroke(1.dp, BorderColor),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier.fillMaxWidth().height(96.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxSize().padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Box(modifier = Modifier.size(56.dp).clip(RoundedCornerShape(16.dp)).background(Color(0xFF2C2C2C)), contentAlignment = Alignment.Center) {
                        Text("🔥", fontSize = 24.sp)
                    }
                    Column {
                        Text("Leg Day", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text("$completedTasks of $totalTasks completed", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    }
                }
                
                // Ring progress placeholder
                Box(contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(progress = { completionPercent }, color = PrimaryColor, trackColor = BorderColor, modifier = Modifier.size(48.dp))
                    Text("${(completionPercent*100).toInt()}%", color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
    }
}
