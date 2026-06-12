import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-remix-icon';
import { useThemeColors } from '../theme/colors';
import { useThemeStore } from '../store/useThemeStore';
import { useProfileStore } from '../store/useProfileStore';
import { SettingRow } from '../components/SettingRow';
import { FadeEdges } from '../components/FadeEdges';

export const SettingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = getStyles(colors);
  
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const profile = useProfileStore();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.Background }}>
      <FadeEdges topHeight={insets.top + 24} bottomHeight={insets.bottom + 120} />
      <ScrollView 
        style={[styles.container, { paddingTop: insets.top + 16 }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Settings</Text>
      
      {/* Profile & Activity Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: profile.avatarUri }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="pencil-line" size={20} color={isDarkMode ? "#FFF" : "#000"} />
          </TouchableOpacity>
        </View>
        
        {/* Activity Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <View style={styles.statIconBox}>
              <Icon name="fire-fill" size={20} color={colors.CardOrange} />
            </View>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(160, 180, 245, 0.2)' }]}>
              <Icon name="check-double-line" size={20} color={colors.CardBlue} />
            </View>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <View style={[styles.statIconBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <Icon name="medal-line" size={20} color={colors.TextTitle} />
            </View>
            <Text style={styles.statValue}>Bronze</Text>
            <Text style={styles.statLabel}>League</Text>
          </View>
        </View>
      </View>

      {/* Preferences Group */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.cardGroup}>
          <SettingRow 
            icon="moon-fill" 
            title="Dark Mode" 
            type="switch" 
            value={isDarkMode} 
            onValueChange={toggleTheme} 
          />
          <SettingRow 
            icon="notification-3-fill" 
            title="Push Notifications" 
            subtitle="Daily reminders & alerts"
            type="switch" 
            value={true} 
            onValueChange={() => {}} 
            isLast={true}
          />
        </View>
      </View>

      {/* Account Group */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <SettingRow 
              icon="user-settings-fill" 
              title="Personal Information" 
            />
          </TouchableOpacity>
          <SettingRow 
            icon="lock-password-fill" 
            title="Privacy & Security" 
          />
          <SettingRow 
            icon="database-2-fill" 
            title="Data Backup" 
            subtitle="Last synced 2 hours ago"
            isLast={true}
          />
        </View>
      </View>

      {/* Other Group */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & About</Text>
        <View style={styles.cardGroup}>
          <SettingRow 
            icon="question-answer-fill" 
            title="Help Center" 
          />
          <SettingRow 
            icon="star-fill" 
            title="Rate the App" 
          />
          <SettingRow 
            icon="logout-box-r-line" 
            title="Log Out" 
            danger={true}
            isLast={true}
          />
        </View>
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
  headerTitle: {
    color: colors.TextTitle,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: colors.Surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.TextTitle,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    color: colors.TextSecondary,
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(150,150,150,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.Background,
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(254, 80, 42, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: colors.TextTitle,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    color: colors.TextSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.SurfaceVariant,
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.TextMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardGroup: {
    backgroundColor: colors.Surface,
    borderRadius: 24,
    overflow: 'hidden',
  },
});
