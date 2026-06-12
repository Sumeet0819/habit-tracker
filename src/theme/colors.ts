import { useThemeStore } from '../store/useThemeStore';

export const DarkTheme = {
  Primary: '#7C4DFF',
  Background: '#1C1C1E',
  Surface: '#2C2C2E',
  SurfaceVariant: '#3A3A3C',
  Border: '#333333',
  Success: '#00C853',
  Warning: '#FFD600',
  Error: '#FF5252',
  TextPrimary: '#FFFFFF',
  TextTitle: '#FFFFFF',
  TextSecondary: '#A0A0A0',
  TextMuted: '#8E8E93',
  TextPrimaryVariant: '#D0BCFF',
  CardOrange: '#FE502A',
  CardBlue: '#A0B4F5',
  CardRed: '#E53935',
  TabBarBg: '#1C1C1E',
};

export const LightTheme = {
  Primary: '#7C4DFF',
  Background: '#F2F2F7',
  Surface: '#FFFFFF',
  SurfaceVariant: '#E5E5EA',
  Border: '#D1D1D6',
  Success: '#34C759',
  Warning: '#FFCC00',
  Error: '#FF3B30',
  TextPrimary: '#000000',
  TextTitle: '#000000',
  TextSecondary: '#3C3C43',
  TextMuted: '#8E8E93',
  TextPrimaryVariant: '#7C4DFF',
  CardOrange: '#FE502A', 
  CardBlue: '#A0B4F5',
  CardRed: '#E53935',
  TabBarBg: '#FFFFFF',
};

export const Colors = DarkTheme; // Fallback for statically imported components

export const useThemeColors = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return isDarkMode ? DarkTheme : LightTheme;
};
