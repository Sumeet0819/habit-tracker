import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashedPillProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  completed: boolean;
}

export const DashedPill = ({ icon, title, subtitle, completed }: DashedPillProps) => (
  <View style={styles.dashedPillContainer}>
    <View style={styles.pillContent}>
      <Ionicons 
        name={icon} 
        size={24} 
        color="#FFF" 
        style={styles.pillIcon} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.pillTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.pillSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  dashedPillContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderStyle: 'dashed',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '100%',
    overflow: 'hidden',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  pillIcon: {
    marginRight: 10,
  },
  pillTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pillSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
});
