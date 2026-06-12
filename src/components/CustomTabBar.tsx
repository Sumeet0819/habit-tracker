import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Icon from 'react-native-remix-icon';
import { useThemeColors } from '../theme/colors';

// Map route names to Remix Icons and display labels
const TabIcons: Record<string, { active: string; inactive: string; label: string }> = {
  Dashboard: { active: 'layout-grid-fill', inactive: 'layout-grid-line', label: 'Overview' },
  Calendar: { active: 'calendar-event-fill', inactive: 'calendar-event-line', label: 'Calendar' },
  Settings: { active: 'settings-4-fill', inactive: 'settings-4-line', label: 'Settings' },
};

export function CustomTabBar({ state, descriptors, navigation }: any) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tabInfo = TabIcons[route.name] || TabIcons['Dashboard'];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
          >
            <MotiView
              animate={{
                backgroundColor: isFocused ? colors.CardOrange : 'transparent',
                width: isFocused ? 130 : 50,
              }}
              transition={{ type: 'timing', duration: 150 }}
              style={[styles.tabItem, { overflow: 'hidden' }]}
            >
              <MotiView
                animate={{
                  scale: isFocused ? 1.1 : 1,
                }}
                transition={{ type: 'timing', duration: 150 }}
              >
                <Icon 
                  name={(isFocused ? tabInfo.active : tabInfo.inactive) as any} 
                  size={20} 
                  color={isFocused ? '#FFF' : colors.TextMuted} 
                />
              </MotiView>
              
              <MotiView
                animate={{
                  opacity: isFocused ? 1 : 0,
                  width: isFocused ? 70 : 0,
                  marginLeft: isFocused ? 8 : 0,
                }}
                transition={{ type: 'timing', duration: 150 }}
              >
                <Text style={styles.tabLabelFocused} numberOfLines={1}>
                  {tabInfo.label}
                </Text>
              </MotiView>
            </MotiView>
          </Pressable>
        );
      })}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: colors.TabBarBg,
    borderRadius: 32,
    height: 64,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  tabLabelFocused: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
