import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-remix-icon';
import { MotiView } from 'moti';
import { useTaskStore } from '../store/useTaskStore';
import { useThemeColors } from '../theme/colors';
import { CustomTimePicker } from '../components/CustomTimePicker';

const DAYS_OF_WEEK = [
  { label: 'S', value: 0 },
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
];

export const ScheduleEditorScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { addNewTask, editTask, removeTask } = useTaskStore();
  const existingTask = route.params?.task;
  const targetDate = route.params?.date || new Date().getTime();

  const colors = useThemeColors();
  const styles = getStyles(colors);

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [hasReminder, setHasReminder] = useState(existingTask?.hasReminder || false);
  
  const initialDay = new Date(targetDate).getDay();
  const [selectedDays, setSelectedDays] = useState<number[]>([initialDay]);
  
  const [startTime, setStartTime] = useState(existingTask ? new Date(existingTask.startTime) : new Date(targetDate));
  const [endTime, setEndTime] = useState(existingTask ? new Date(existingTask.endTime) : new Date(targetDate + 3600000));
  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isTitleFocused, setTitleFocused] = useState(false);
  const [isDescFocused, setDescFocused] = useState(false);

  const toggleDay = (dayValue: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayValue)) {
        if (prev.length === 1) return prev; 
        return prev.filter(d => d !== dayValue);
      } else {
        return [...prev, dayValue].sort();
      }
    });
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title.');
      return;
    }

    if (startTime.getTime() >= endTime.getTime()) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }

    try {
      if (existingTask?.id) {
        const taskData = {
          title,
          description,
          category: existingTask.category || 'Personal',
          priority: existingTask.priority || 1,
          startTime: startTime.getTime(),
          endTime: endTime.getTime(),
          completed: existingTask.completed || false,
          date: existingTask.date,
          hasReminder,
        };
        await editTask({ ...taskData, id: existingTask.id, notificationId: existingTask.notificationId });
      } else {
        const baseDate = new Date(targetDate);
        const currentDayOfWeek = baseDate.getDay();

        for (const day of selectedDays) {
          const dayDiff = day - currentDayOfWeek;
          
          const newTargetDate = new Date(baseDate);
          newTargetDate.setDate(baseDate.getDate() + dayDiff);
          newTargetDate.setHours(0, 0, 0, 0);

          const newStartTime = new Date(startTime);
          newStartTime.setFullYear(newTargetDate.getFullYear(), newTargetDate.getMonth(), newTargetDate.getDate());
          
          const newEndTime = new Date(endTime);
          newEndTime.setFullYear(newTargetDate.getFullYear(), newTargetDate.getMonth(), newTargetDate.getDate());

          const taskData = {
            title,
            description,
            category: 'Personal',
            priority: 1,
            startTime: newStartTime.getTime(),
            endTime: newEndTime.getTime(),
            completed: false,
            date: newTargetDate.getTime(),
            hasReminder,
          };

          await addNewTask(taskData);
        }
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save schedule.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Schedule', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          if (existingTask?.id) {
            await removeTask(existingTask.id, existingTask.date);
            navigation.goBack();
          }
        }
      }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-left-line" size={28} color={colors.TextTitle} />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          {existingTask && (
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <Icon name="delete-bin-line" size={24} color={colors.Error} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.headerSaveButton, !title.trim() && { opacity: 0.4 }]}
            onPress={handleSave}
            disabled={!title.trim()}
            accessibilityRole="button"
            accessibilityLabel="Save Schedule"
          >
            <Text style={styles.headerSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAwareScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', duration: 400, delay: 50 }}
        >
          <Text style={styles.mainTitle}>{existingTask ? 'Edit Habit' : 'New Habit'}</Text>
          <Text style={styles.mainSubtitle}>Set up your routine for success</Text>
        </MotiView>

        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', duration: 400, delay: 150 }}
          style={styles.card}
        >
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, isTitleFocused && styles.inputFocused]}
            placeholder="e.g. Morning Workout"
            placeholderTextColor={colors.TextMuted}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
          />

          <Text style={[styles.label, { marginTop: 24 }]}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, isDescFocused && styles.inputFocused]}
            placeholder="Details about this schedule..."
            placeholderTextColor={colors.TextMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            onFocus={() => setDescFocused(true)}
            onBlur={() => setDescFocused(false)}
          />
        </MotiView>

        {!existingTask && (
          <MotiView 
            from={{ opacity: 0, translateY: 20 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', duration: 400, delay: 250 }}
            style={styles.card}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(254, 80, 42, 0.1)' }]}>
                <Icon name="calendar-event-line" size={20} color={colors.CardOrange} />
              </View>
              <Text style={styles.sectionTitle}>Repeat Schedule</Text>
            </View>
            <Text style={styles.subtitle}>Select the days to apply this schedule to this week.</Text>
            
            <View style={styles.daysRow}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day.value);
                return (
                  <TouchableOpacity 
                    key={day.value} 
                    style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
                    onPress={() => toggleDay(day.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </MotiView>
        )}

        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', duration: 400, delay: 350 }}
          style={styles.card}
        >
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(160, 180, 245, 0.1)' }]}>
              <Icon name="time-line" size={20} color={colors.CardBlue} />
            </View>
            <Text style={styles.sectionTitle}>24-Hour Schedule</Text>
          </View>
          
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Start Time</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeButton} activeOpacity={0.7}>
              <Text style={styles.timeButtonText}>
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>End Time</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeButton} activeOpacity={0.7}>
              <Text style={styles.timeButtonText}>
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', duration: 400, delay: 450 }}
          style={styles.card}
        >
          <View style={styles.timeRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                <Icon name="notification-3-line" size={20} color={colors.Success || '#34C759'} />
              </View>
              <View>
                <Text style={styles.timeLabel}>Reminder Alarm</Text>
                <Text style={styles.subtitle}>Notify me when this starts</Text>
              </View>
            </View>
            <Switch 
              value={hasReminder} 
              onValueChange={setHasReminder} 
              trackColor={{ true: colors.CardOrange, false: colors.SurfaceVariant }} 
              thumbColor="#FFF"
            />
          </View>
        </MotiView>

      </KeyboardAwareScrollView>

      <CustomTimePicker
        visible={showStartPicker}
        title="Start Time"
        initialDate={startTime}
        onClose={() => setShowStartPicker(false)}
        onSave={setStartTime}
      />
      
      <CustomTimePicker
        visible={showEndPicker}
        title="End Time"
        initialDate={endTime}
        onClose={() => setShowEndPicker(false)}
        onSave={setEndTime}
      />
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
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSaveButton: {
    backgroundColor: colors.CardOrange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSaveText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.Surface,
    borderRadius: 22,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.TextTitle,
    marginTop: 8,
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 16,
    color: colors.TextSecondary,
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
  },
  card: {
    backgroundColor: colors.Surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  label: {
    color: colors.TextSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.Background,
    borderRadius: 16,
    padding: 16,
    color: colors.TextTitle,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: colors.CardOrange,
    backgroundColor: colors.SurfaceVariant,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    color: colors.TextTitle,
    fontSize: 18,
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.Background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.CardOrange,
  },
  dayText: {
    color: colors.TextSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    color: colors.TextTitle,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.TextMuted,
    fontSize: 13,
    marginTop: 4,
  },
  timeButton: {
    backgroundColor: colors.Background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  timeButtonText: {
    color: colors.TextTitle,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.Border,
    marginVertical: 18,
  },
});
