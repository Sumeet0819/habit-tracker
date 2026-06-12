import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-remix-icon';
import { TaskService } from '../services/TaskService';
import { Task } from '../data/repositories/TaskRepository';
import { useIsFocused } from '@react-navigation/native';
import { useThemeColors } from '../theme/colors';
import { FadeEdges } from '../components/FadeEdges';

export const CalendarScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [weeks, setWeeks] = useState<{ date: Date; tasks: Task[] }[]>([]);

  const colors = useThemeColors();
  const styles = getStyles(colors);

  useEffect(() => {
    if (isFocused) {
      load1WeekSchedule();
    }
  }, [isFocused]);

  const load1WeekSchedule = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedule = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      
      const tasks = TaskService.getTasksForDate(targetDate.getTime());
      
      schedule.push({
        date: targetDate,
        tasks,
      });
    }

    setWeeks(schedule);
  };

  const renderDay = ({ item }: { item: { date: Date; tasks: Task[] } }) => {
    const isToday = item.date.getTime() === new Date().setHours(0,0,0,0);
    const dayName = item.date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayDate = item.date.getDate();
    const month = item.date.toLocaleDateString('en-US', { month: 'short' });

    return (
      <View style={styles.dayContainer}>
        <View style={styles.dateCol}>
          <Text style={[styles.dayName, isToday && { color: colors.CardOrange }]}>{dayName}</Text>
          <View style={[styles.dateCircle, isToday && { backgroundColor: colors.CardOrange }]}>
            <Text style={[styles.dayDate, isToday && { color: '#FFF' }]}>{dayDate}</Text>
          </View>
          <Text style={styles.monthName}>{month}</Text>
        </View>

        <View style={styles.tasksCol}>
          {item.tasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={[styles.taskCard, task.completed && { opacity: 0.5 }]}
              onPress={() => navigation.navigate('ScheduleEditor', { task })}
            >
              <View style={styles.taskCardHeader}>
                <Text style={[styles.taskTitle, task.completed && { textDecorationLine: 'line-through' }]}>
                  {task.title}
                </Text>
                {task.hasReminder && <Icon name="notification-3-fill" size={14} color={colors.CardBlue} />}
              </View>
              <Text style={styles.taskTime}>
                {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={[styles.emptyTaskSlot, item.tasks.length > 0 && { height: 36, marginTop: 4 }]}
            onPress={() => navigation.navigate('ScheduleEditor', { date: item.date.getTime() })}
          >
            <Icon name="add-circle-line" size={16} color={colors.TextSecondary} />
            <Text style={[styles.emptyTaskText, { fontSize: 13 }]}>
              {item.tasks.length === 0 ? 'Tap to plan' : 'Add another task'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FadeEdges topHeight={insets.top + 24} bottomHeight={insets.bottom + 120} />
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Calendar</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ScheduleEditor')}>
            <Icon name="add-line" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={weeks}
          keyExtractor={(item) => item.date.toISOString()}
          renderItem={renderDay}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: colors.TextTitle,
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.CardOrange,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  dayContainer: {
    flexDirection: 'row',
    backgroundColor: colors.Surface,
    borderRadius: 24,
    padding: 16,
  },
  dateCol: {
    width: 60,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.Border,
    paddingRight: 16,
    marginRight: 16,
  },
  dayName: {
    color: colors.TextSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(150,150,150,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayDate: {
    color: colors.TextTitle,
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthName: {
    color: colors.TextSecondary,
    fontSize: 12,
  },
  tasksCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  emptyTaskSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.Border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  emptyTaskText: {
    color: colors.TextSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  taskCard: {
    backgroundColor: colors.SurfaceVariant,
    borderRadius: 12,
    padding: 12,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    color: colors.TextTitle,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  taskTime: {
    color: colors.CardBlue,
    fontSize: 12,
    fontWeight: '500',
  },
});
