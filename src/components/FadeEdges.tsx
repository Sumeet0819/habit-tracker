import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../theme/colors';

interface FadeEdgesProps {
  topHeight?: number;
  bottomHeight?: number;
}

/**
 * Renders absolutely-positioned gradient overlays at the top and bottom
 * of its parent container, creating a soft "fade" edge effect as content
 * scrolls beneath the safe-area insets.
 *
 * Usage: Place inside any screen's root <View> as a sibling of the ScrollView.
 * The parent must have `position: 'relative'` (the default for Views).
 */
export const FadeEdges: React.FC<FadeEdgesProps> = ({
  topHeight = 80,
  bottomHeight = 120,
}) => {
  const colors = useThemeColors();

  // Add an alpha channel to the hex color for a "lighter" blur/fade effect
  // 'E6' is 90% opacity, 'CC' is 80%, 'B3' is 70%
  const fadeColor = colors.Background + 'CC';

  const topColors: [string, string] = [fadeColor, 'transparent'];
  const bottomColors: [string, string] = ['transparent', fadeColor];

  return (
    <>
      {/* Top fade */}
      <LinearGradient
        colors={topColors}
        style={[styles.edge, styles.top, { height: topHeight }]}
        pointerEvents="none"
      />
      {/* Bottom fade */}
      <LinearGradient
        colors={bottomColors}
        style={[styles.edge, styles.bottom, { height: bottomHeight }]}
        pointerEvents="none"
      />
    </>
  );
};

const styles = StyleSheet.create({
  edge: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});
