export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.getDate().toString().padStart(2, '0');
};

export const formatWeekday = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

export const getStartOfDayTimestamp = (date: Date = new Date()): number => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay.getTime();
};
