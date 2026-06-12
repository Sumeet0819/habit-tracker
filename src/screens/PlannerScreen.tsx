import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useThemeColors } from '../theme/colors';
import { useTaskStore } from '../store/useTaskStore';
import { useProfileStore } from '../store/useProfileStore';
import { getStartOfDayTimestamp, formatDay, formatWeekday, formatTime } from '../utils/dateUtils';
import { Task } from '../data/repositories/TaskRepository';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PlannerScreen = () => {
  const insets = useSafeAreaInsets();
  const { todayTasks, loadTasksForDate, toggleTaskComplete } = useTaskStore();
  const profile = useProfileStore();
  
  const colors = useThemeColors();
  const styles = getStyles(colors);

  useEffect(() => {
    // Load tasks for today on mount
    loadTasksForDate(getStartOfDayTimestamp());
  }, []);

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.timelineItemContainer}>
      {/* Date Indicator */}
      <View style={styles.dateColumn}>
        <Text style={styles.dateDay}>{formatDay(item.startTime)}</Text>
        <Text style={styles.dateWeekday}>{formatWeekday(item.startTime)}</Text>
      </View>
      
      {/* Task Card */}
      <TouchableOpacity 
        style={[styles.taskCard, item.completed && styles.taskCardCompleted]}
        activeOpacity={0.7}
        onPress={() => toggleTaskComplete(item)}
      >
        <View style={styles.taskCardContent}>
          <View style={styles.taskDetails}>
            <View style={styles.taskTitleRow}>
              <View style={[styles.taskIndicator, item.completed && styles.taskIndicatorCompleted]} />
              <Text style={styles.taskTitle}>{item.title}</Text>
            </View>
            <Text style={styles.taskCategory}>{item.category}</Text>
            {item.completed && <Text style={styles.taskCompletedText}>Completed</Text>}
          </View>
          <Text style={styles.taskTime}>{formatTime(item.startTime)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingText}>HELLO THERE!</Text>
          <Text style={styles.userNameText}>{profile.name}</Text>
        </View>
        <Image source={{ uri: profile.avatarUri }} style={styles.avatarContainer} />
      </View>
      
      <Text style={styles.headerTitle}>Check your{'\n'}schedule today</Text>
      
      {/* Timeline View */}
      <FlatList
        data={todayTasks}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks scheduled for today.</Text>
        }
      />
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  greetingText: {
    color: colors.TextSecondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
  },
  userNameText: {
    color: colors.TextTitle,
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    color: colors.TextTitle,
    fontWeight: 'bold',
    fontSize: 32,
    lineHeight: 38,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  timelineItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  dateColumn: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  dateDay: {
    color: colors.TextTitle,
    fontWeight: 'bold',
    fontSize: 20,
  },
  dateWeekday: {
    color: colors.TextMuted,
    fontSize: 11,
    fontWeight: 'bold',
  },
  taskCard: {
    flex: 1,
    minHeight: 100,
    backgroundColor: colors.Surface,
    borderColor: colors.Border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
  },
  taskCardCompleted: {
    backgroundColor: colors.SurfaceVariant,
  },
  taskCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  taskDetails: {
    gap: 8,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.Primary,
    marginRight: 8,
  },
  taskIndicatorCompleted: {
    backgroundColor: colors.Success,
  },
  taskTitle: {
    color: colors.TextPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskCategory: {
    color: colors.TextMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  taskCompletedText: {
    color: colors.Success,
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskTime: {
    color: colors.TextMuted,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: colors.TextMuted,
    paddingVertical: 32,
    textAlign: 'center',
  },
});
