import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useThemeColors } from '../theme/colors';

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  type?: 'link' | 'switch';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  isLast?: boolean;
  danger?: boolean;
}

export const SettingRow = ({ 
  icon, 
  title, 
  subtitle, 
  type = 'link', 
  value = false, 
  onValueChange, 
  isLast = false,
  danger = false
}: SettingRowProps) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <View style={[styles.settingRowContainer, !isLast && styles.borderBottom]}>
      <View style={styles.settingRowLeft}>
        <View style={[styles.iconWrapper, danger && { backgroundColor: 'rgba(255,69,58,0.1)' }]}>
          <Icon name={icon} size={20} color={danger ? colors.Error : colors.TextSecondary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, danger && { color: colors.Error }]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.settingRowRight}>
        {type === 'switch' ? (
          <Switch 
            value={value} 
            onValueChange={onValueChange} 
            trackColor={{ true: colors.CardOrange, false: colors.SurfaceVariant }} 
            thumbColor="#FFF"
          />
        ) : (
          <Icon name="arrow-right-s-line" size={24} color={colors.TextMuted} />
        )}
      </View>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  settingRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.Surface,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.Border,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(150,150,150,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    color: colors.TextTitle,
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    color: colors.TextSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  settingRowRight: {
    marginLeft: 16,
  },
});
