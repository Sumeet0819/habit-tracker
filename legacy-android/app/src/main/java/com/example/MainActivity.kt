package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.ListAlt
import androidx.compose.material.icons.filled.Settings
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.ui.MainViewModel
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.PlannerScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.PrimaryColor
import com.example.ui.theme.SurfaceColor
import com.example.ui.theme.TextSecondary

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                MainApp()
            }
        }
    }
}

@Composable
fun MainApp() {
    val navController = rememberNavController()
    val viewModel: MainViewModel = viewModel()
    
    val items = listOf(
        BottomNavItem("dashboard", "Overview", Icons.Filled.Dashboard),
        BottomNavItem("planner", "Planner", Icons.Filled.ListAlt),
        BottomNavItem("calendar", "Calendar", Icons.Filled.CalendarMonth),
        BottomNavItem("settings", "Settings", Icons.Filled.Settings),
    )

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* TODO: Open add task */ },
                containerColor = com.example.ui.theme.TextPrimaryVariant,
                contentColor = Color(0xFF381E72),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
                modifier = Modifier.padding(bottom = 8.dp).size(56.dp)
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Task")
            }
        },
        floatingActionButtonPosition = FabPosition.Center,
        bottomBar = {
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentDestination = navBackStackEntry?.destination
            Surface(
                modifier = Modifier.padding(16.dp),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(32.dp),
                shadowElevation = 8.dp,
                border = androidx.compose.foundation.BorderStroke(1.dp, com.example.ui.theme.BorderColor)
            ) {
                NavigationBar(
                    containerColor = Color(0xFF2B2930),
                    modifier = Modifier.height(72.dp)
                ) {
                    items.forEach { item ->
                        NavigationBarItem(
                            icon = { Icon(item.icon, contentDescription = item.title) },
                            label = { Text(item.title, fontSize = 10.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Medium) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = com.example.ui.theme.TextPrimaryVariant,
                                unselectedIconColor = Color.White.copy(alpha = 0.6f),
                                selectedTextColor = com.example.ui.theme.TextPrimaryVariant,
                                unselectedTextColor = Color.White.copy(alpha = 0.6f),
                                indicatorColor = Color.Transparent
                            ),
                            selected = currentDestination?.route == item.route,
                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.startDestinationId) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "dashboard",
            modifier = Modifier.padding(innerPadding).fillMaxSize()
        ) {
            composable("dashboard") { DashboardScreen(viewModel) }
            composable("planner") { PlannerScreen(viewModel) }
            composable("calendar") { 
                androidx.compose.foundation.layout.Box(Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) { Text("Calendar", color = Color.White) }
            }
            composable("settings") { 
                androidx.compose.foundation.layout.Box(Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) { Text("Settings", color = Color.White) }
            }
        }
    }
}

data class BottomNavItem(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)
