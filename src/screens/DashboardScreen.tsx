import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskStore } from '../store/useTaskStore';
import { TaskService } from '../services/TaskService';
import { useIsFocused } from '@react-navigation/native';
import { useThemeColors } from '../theme/colors';
import { useProfileStore } from '../store/useProfileStore';

import { DashedPill } from '../components/DashedPill';
import { FadeEdges } from '../components/FadeEdges';

export const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { todayTasks, loadTasksForDate, toggleTaskComplete } = useTaskStore();
  const profile = useProfileStore();

  const colors = useThemeColors();
  const styles = getStyles(colors);
  
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  const loadData = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    loadTasksForDate(today);
    // Load tasks for the next 7 days for the Activity section
    const next7Days = today + 7 * 24 * 60 * 60 * 1000;
    const tasks = TaskService.getTasksForNext7Weeks(today);
    // Filter to only next 7 days, sorted by startTime
    const filtered = tasks
      .filter(t => t.date >= today && t.date <= next7Days)
      .sort((a, b) => a.startTime - b.startTime);
    setUpcomingTasks(filtered);
  };

  // Load on mount immediately, then re-load whenever screen comes into focus
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const analytics = TaskService.getAnalytics(new Date().setHours(0,0,0,0));

  const now = Date.now();
  const upcomingTask = todayTasks
    .filter((t) => !t.completed && t.startTime > now)
    .sort((a, b) => a.startTime - b.startTime)[0] ?? null;

  // For activity section: use upcoming tasks across next 7 days
  const sortedTasks = upcomingTasks;
  
  // Active task = started but not yet ended
  const activeTask = sortedTasks.find(t => t.startTime <= now && t.endTime > now) ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.Background }}>
      <FadeEdges topHeight={insets.top + 24} bottomHeight={insets.bottom + 120} />
      <ScrollView 
        style={[styles.container, { paddingTop: insets.top + 16 }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
      
      {/* Header Area */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: profile.avatarUri }} 
            style={styles.avatar} 
          />
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingText}>Hello there!👋🏾</Text>
            <Text style={styles.userName}>{profile.name}</Text>
          </View>
        </View>
        
        <View style={styles.bellContainer}>
          <Ionicons name="notifications" size={24} color={colors.TextTitle} />
          <View style={styles.redDot} />
        </View>
      </View>

      {/* Main Content Grid */}
      <View style={styles.cardsGrid}>
        
        {/* Orange Card: Workout Plan */}
        <View style={styles.orangeCard}>
          <View style={styles.orangeCardHeader}>
            <Text style={styles.orangeCardTitle}>Today's{'\n'}Plan</Text>
            <TouchableOpacity 
              style={styles.brushIconContainer}
              onPress={() => navigation.navigate('ScheduleEditor')}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pillsContainer}>
            {(() => {
              const nextTwo = todayTasks
                .filter((t) => !t.completed && t.startTime > now)
                .sort((a, b) => a.startTime - b.startTime)
                .slice(0, 2);

              if (nextTwo.length === 0) {
                return (
                  <Text style={{ color: '#FFF', opacity: 0.8 }}>
                    {todayTasks.length === 0 ? 'No tasks scheduled yet.' : 'All tasks done for today! 🎉'}
                  </Text>
                );
              }

              return nextTwo.map((task) => (
                <TouchableOpacity key={task.id} onPress={() => toggleTaskComplete(task)}>
                  <DashedPill
                    icon="ellipse-outline"
                    title={task.title}
                    subtitle={new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    completed={task.completed}
                  />
                </TouchableOpacity>
              ));
            })()}
          </View>
        </View>

        {/* Blue Card: Daily Cardio */}
        <View style={styles.blueCard}>
          <View>
            <Text style={styles.blueCardDate}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            <Text style={styles.blueCardTitle}>Your Streak{'\n'}Is Active!</Text>
            <Text style={[styles.blueCardTitle, { marginTop: 8, fontSize: 32 }]}>{analytics.activeStreak} 🔥</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton} 
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={styles.startButtonText}>View All</Text>
            <View style={styles.playButton}>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
        
      </View>

      {/* Bottom White Card */}
      <View style={styles.whiteCard}>
        <View style={styles.whiteCardLeft}>
          <View style={styles.legIconContainer}>
            <MaterialCommunityIcons name="target" size={28} color="#FFF" />
          </View>
          <View>
            <Text style={styles.whiteCardTitle}>Daily Goal</Text>
            <Text style={styles.whiteCardSubtitle}>{analytics.completed} of {analytics.total} completed</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <Svg width="60" height="60" viewBox="0 0 60 60" style={{ position: 'absolute' }}>
            <Circle 
              cx="30" cy="30" r="26" 
              stroke={colors.SurfaceVariant} 
              strokeWidth="4" 
              fill="transparent" 
            />
            <Circle 
              cx="30" cy="30" r="26" 
              stroke={colors.CardOrange} 
              strokeWidth="4" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 26}
              strokeDashoffset={2 * Math.PI * 26 * (1 - analytics.percentage / 100)}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
          </Svg>
          <Text style={styles.progressText}>{analytics.percentage}%</Text>
        </View>
      </View>

      {/* Upcoming Activity Section */}
      <View style={styles.activitySection}>
        <Text style={styles.activityTitle}>Upcoming Activity</Text>

        {sortedTasks.length === 0 ? (
          <Text style={styles.activityEmpty}>No upcoming activities this week.</Text>
        ) : (
          sortedTasks.map((task, index) => {
            const isActive = activeTask?.id === task.id;
            const isPast = task.endTime <= now;
            const isLast = index === sortedTasks.length - 1;
            const taskDate = new Date(task.date);
            const todayStart = new Date().setHours(0, 0, 0, 0);
            const tomorrowStart = todayStart + 86400000;
            const diffDays = Math.round((task.date - todayStart) / 86400000);
            const dayLabel = diffDays === 0
              ? 'Today'
              : diffDays === 1
              ? 'Tomorrow'
              : taskDate.toLocaleDateString('en-US', { weekday: 'long' });
            const startTimeLabel = new Date(task.startTime).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            // Show day header if first item or day changed from previous task
            const prevTask = index > 0 ? sortedTasks[index - 1] : null;
            const showDayHeader = !prevTask || prevTask.date !== task.date;

            return (
              <React.Fragment key={task.id ?? index}>
                {showDayHeader && (
                  <Text style={styles.activityDayHeader}>{dayLabel}</Text>
                )}
                <View style={styles.activityItem}>
                  {/* Left: timeline dot + dashed line */}
                  <View style={styles.timelineCol}>
                    <View style={[
                      styles.timelineDot,
                      isActive && styles.timelineDotActive,
                      !isActive && !isPast && styles.timelineDotUpcoming,
                      isPast && !isActive && styles.timelineDotPast,
                    ]}>
                      {isActive && <View style={styles.timelineDotInner} />}
                    </View>
                    {!isLast && <View style={styles.timelineDash} />}
                  </View>

                  {/* Right: task info */}
                  <View style={styles.activityContent}>
                    <View style={styles.activityRow}>
                      <View style={styles.activityTextCol}>
                        <Text style={[
                          styles.activityTaskTitle,
                          isPast && !isActive && styles.activityTaskTitlePast,
                        ]}>
                          {task.title}
                        </Text>
                        <Text style={styles.activityTaskMeta}>
                          {startTimeLabel}{task.category ? `  ·  ${task.category}` : ''}
                        </Text>
                      </View>

                      {isActive ? (
                        <View style={styles.nowBadge}>
                          <Text style={styles.nowBadgeText}>Now</Text>
                        </View>
                      ) : (
                        <Text style={styles.activityTime}>{startTimeLabel}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </React.Fragment>
            );
          })
        )}
      </View>
      
    </ScrollView>
    </View>
  );
};


const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  greetingTextContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    color: colors.TextSecondary,
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    color: colors.TextTitle,
    fontSize: 24,
    fontWeight: '700',
  },
  bellContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.Surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.Error,
  },
  cardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  orangeCard: {
    flex: 1,
    backgroundColor: colors.CardOrange,
    borderRadius: 32,
    padding: 20,
    minHeight: 280,
  },
  orangeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  orangeCardTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  brushIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillsContainer: {
    gap: 12,
  },
  blueCard: {
    flex: 1,
    backgroundColor: colors.CardBlue,
    borderRadius: 32,
    padding: 20,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  blueCardDate: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  blueCardTitle: {
    color: '#000',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  startButton: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCard: {
    backgroundColor: colors.Surface,
    borderRadius: 32,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  whiteCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.CardOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  whiteCardTitle: {
    color: colors.TextTitle,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  whiteCardSubtitle: {
    color: colors.TextSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressCircleBg: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: colors.SurfaceVariant,
  },
  progressCircleFg: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: colors.CardOrange,
    borderLeftColor: 'transparent', 
    borderBottomColor: 'transparent',
    transform: [{ rotate: '45deg' }]
  },
  progressText: {
    color: colors.TextTitle,
    fontSize: 14,
    fontWeight: '700',
  },

  // Today's Activity
  activitySection: {
    marginTop: 32,
    paddingHorizontal: 4,
  },
  activityTitle: {
    color: colors.TextTitle,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 28,
  },
  activityEmpty: {
    color: colors.TextMuted,
    fontSize: 15,
    paddingVertical: 16,
  },
  activityDayHeader: {
    color: colors.TextMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
    marginTop: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineCol: {
    width: 44,
    alignItems: 'center',
    marginRight: 16,
  },
  // Default dot: upcoming (ring only, no fill)
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: colors.SurfaceVariant,
    backgroundColor: colors.Background,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  // Active: thick grey ring with white inner dot (matches image)
  timelineDotActive: {
    borderWidth: 4,
    borderColor: colors.TextSecondary,
    backgroundColor: colors.Background,
  },
  // Upcoming: subtle border
  timelineDotUpcoming: {
    borderWidth: 2,
    borderColor: colors.Border,
    backgroundColor: colors.Background,
  },
  // Past: small filled diamond-ish dot
  timelineDotPast: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 0,
    backgroundColor: colors.SurfaceVariant,
    marginTop: 8,
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.TextTitle,
  },
  timelineDash: {
    width: 2,
    borderStyle: 'dashed',
    borderLeftWidth: 2,
    borderColor: colors.Border,
    minHeight: 52,
    marginVertical: 4,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 36,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 26,
  },
  activityTextCol: {
    flex: 1,
    marginRight: 16,
  },
  activityTaskTitle: {
    color: colors.TextTitle,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTaskTitlePast: {
    color: colors.TextMuted,
  },
  activityTaskMeta: {
    color: colors.TextMuted,
    fontSize: 14,
    fontWeight: '400',
  },
  nowBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 40,
  },
  nowBadgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 17,
  },
  activityTime: {
    color: colors.TextMuted,
    fontSize: 14,
    fontWeight: '500',
  },
});
