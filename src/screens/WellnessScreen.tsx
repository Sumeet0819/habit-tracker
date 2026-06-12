import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useProfileStore } from '../store/useProfileStore';
import { FadeEdges } from '../components/FadeEdges';
import Svg, { Circle, Path } from 'react-native-svg';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

const Bubble = ({ size, left, delay, duration }: { size: number, left: any, delay: number, duration: number }) => (
  <MotiView
    from={{ translateY: 20, opacity: 0, scale: 0.5 }}
    animate={{ translateY: -250, opacity: 0.6, scale: 1.2 }}
    transition={{
      type: 'timing',
      duration,
      delay,
      loop: true,
      easing: Easing.inOut(Easing.ease),
    }}
    style={{
      position: 'absolute',
      left,
      bottom: -10,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'rgba(255,255,255,0.4)',
      zIndex: 0,
    }}
  />
);

export const WellnessScreen = () => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const profile = useProfileStore();
  const styles = getStyles(colors);

  const [healthData, setHealthData] = useState({
    steps: 0,
    goalSteps: 10000,
    calories: 0,
    distance: 0,
  });

  const [weatherData, setWeatherData] = useState({
    temp: '--',
    condition: 'Loading...',
    location: 'Locating...',
    humidity: '--',
    co2: '--',
  });

  const pastStepsRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    let subscription: Pedometer.Subscription | null = null;

    const fetchWeather = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) setWeatherData(prev => ({ ...prev, condition: 'Permission Denied', location: 'Unknown' }));
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit`);
        const data = await response.json();
        
        if (data.current && isMounted) {
          const code = data.current.weather_code;
          let condition = 'Clear';
          if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
          if (code >= 45 && code <= 48) condition = 'Foggy';
          if (code >= 51 && code <= 67) condition = 'Rain';
          if (code >= 71 && code <= 77) condition = 'Snow';
          if (code >= 95) condition = 'Thunderstorm';

          let reverse = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
          let locStr = 'Unknown Location';
          if (reverse && reverse.length > 0) {
            locStr = `${reverse[0].city || reverse[0].name}, ${reverse[0].region || reverse[0].country}`;
          }

          setWeatherData({
            temp: Math.round(data.current.temperature_2m).toString(),
            condition: condition,
            location: locStr,
            humidity: data.current.relative_humidity_2m.toString(),
            co2: Math.floor(Math.random() * 200 + 400).toString(),
          });
        }
      } catch (e) {
        console.error('Weather fetch error:', e);
        if (isMounted) setWeatherData(prev => ({ ...prev, condition: 'Weather Unavailable', location: 'Offline' }));
      }
    };

    const setupPedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (isAvailable) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          try {
            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
            if (pastStepCountResult && isMounted) {
              pastStepsRef.current = pastStepCountResult.steps;
              setHealthData(prev => ({
                ...prev,
                steps: pastStepsRef.current,
                calories: Math.round(pastStepsRef.current * 0.04),
                distance: parseFloat((pastStepsRef.current * 0.0008).toFixed(2))
              }));
            }
          } catch (e) {
            console.log('Could not get past steps (common on some Androids without Google Fit setup):', e);
          }

          subscription = Pedometer.watchStepCount(result => {
            if (isMounted) {
              const totalSteps = pastStepsRef.current + result.steps;
              setHealthData(prev => ({
                ...prev,
                steps: totalSteps,
                calories: Math.round(totalSteps * 0.04),
                distance: parseFloat((totalSteps * 0.0008).toFixed(2))
              }));
            }
          });
        }
      } catch (e) {
        console.log('Pedometer setup error:', e);
      }
    };

    fetchWeather();
    setupPedometer();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const weightData = {
    current: 165, // lbs
    change: '-2.5',
    goal: 155,
  };

  const utilityData = {
    water: 4, // glasses
    waterGoal: 8,
    sleep: '6h 45m',
    sleepQuality: 'Good',
  };

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
              <Text style={styles.greetingText}>Your Wellness</Text>
              <Text style={styles.userName}>Daily Insights</Text>
            </View>
          </View>
        </View>

        {/* Weather Card */}
        <View style={[styles.weatherCard, { backgroundColor: colors.CardBlue }]}>
          <View>
            <Text style={styles.weatherLocation}>{weatherData.location}</Text>
            <Text style={styles.weatherTemp}>{weatherData.temp}°</Text>
            <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
          </View>
          <Ionicons name="partly-sunny" size={80} color="#000" style={{ opacity: 0.8 }} />
        </View>

        {/* Physical Activity Card */}
        <View style={[styles.activityCard, { backgroundColor: colors.CardOrange }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitleWhite}>Physical Activity</Text>
            <MaterialCommunityIcons name="run-fast" size={24} color="#FFF" />
          </View>

          <View style={styles.statsRow}>
            {/* Steps Progress */}
            <View style={styles.progressContainer}>
              <Svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute' }}>
                <Circle
                  cx="40" cy="40" r="34"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <Circle
                  cx="40" cy="40" r="34"
                  stroke="#FFF"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - healthData.steps / healthData.goalSteps)}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </Svg>
              <View style={styles.progressInner}>
                <Ionicons name="footsteps" size={20} color="#FFF" />
              </View>
            </View>
            
            <View style={styles.statsInfo}>
              <Text style={styles.statMainWhite}>{healthData.steps} <Text style={styles.statSubWhite}>steps</Text></Text>
              <Text style={styles.statMetaWhite}>{healthData.calories} kcal  •  {healthData.distance} km</Text>
            </View>
          </View>
        </View>

        {/* New Utility Card from Image */}
        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, delay: 100 }}
          style={styles.utilityCardContainer}
        >
          {/* Left Column (Temperature) */}
          <View style={styles.utilityLeftColumn}>
            <MotiView 
              from={{ height: '0%' }}
              animate={{ height: '50%' }}
              transition={{ type: 'timing', duration: 1000, delay: 300 }}
              style={styles.utilityTempFill} 
            />
            <MotiView 
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', damping: 12, delay: 200 }}
              style={styles.utilityTempContent}
            >
              <Text style={styles.utilityTempText}>{weatherData.temp}°</Text>
              <Text style={styles.utilityTempLabel}>Room{'\n'}temp.</Text>
            </MotiView>
            <View style={[styles.utilityTempPill, { bottom: '50%' }]} />
          </View>

          {/* Right Column */}
          <View style={styles.utilityRightColumn}>
            {/* Top Right: CO2 */}
            <LinearGradient
              colors={['#54D669', '#38C958']}
              style={[styles.utilityQuadrant, { overflow: 'hidden' }]}
            >
              <Bubble size={12} left="15%" delay={0} duration={3000} />
              <Bubble size={8} left="45%" delay={1000} duration={2500} />
              <Bubble size={16} left="75%" delay={500} duration={3500} />
              <Bubble size={6} left="25%" delay={1500} duration={2000} />
              <Bubble size={10} left="60%" delay={200} duration={2800} />
              <Bubble size={14} left="85%" delay={1200} duration={3200} />
              <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 500 }}
                style={{ zIndex: 1 }}
              >
                <Text style={styles.utilityQuadrantValue}>{weatherData.co2}</Text>
                <Text style={styles.utilityQuadrantLabel}>CO<Text style={{ fontSize: 16, lineHeight: 20 }}>2</Text></Text>
              </MotiView>
            </LinearGradient>

            {/* Bottom Right: Humidity */}
            <View style={[styles.utilityQuadrant, { backgroundColor: '#344155', overflow: 'hidden', padding: 0 }]}>
              {/* Blue Fill with Wave */}
              <MotiView 
                from={{ height: '0%' }}
                animate={{ height: `${weatherData.humidity === '--' ? 50 : weatherData.humidity}%` as any }}
                transition={{ type: 'timing', duration: 1000, delay: 400 }}
                style={styles.utilityHumidityFill}
              >
                <MotiView
                  from={{ translateX: 0 }}
                  animate={{ translateX: -200 }}
                  transition={{ type: 'timing', duration: 1200, loop: true, easing: Easing.linear }}
                  style={{ position: 'absolute', top: -11, left: 0, right: 0, width: 1000 }}
                >
                  <Svg height="12" width="1000" viewBox="0 0 500 12" preserveAspectRatio="none">
                    <Path d="M0 12 V4 Q 25 0 50 4 T 100 4 T 150 4 T 200 4 T 250 4 T 300 4 T 350 4 T 400 4 T 450 4 T 500 4 V 12 Z" fill="#7CB9E8" />
                  </Svg>
                </MotiView>
              </MotiView>
              <MotiView 
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 600 }}
                style={{ zIndex: 2, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', padding: 16 }}
              >
                <Text style={styles.utilityQuadrantValue}>{weatherData.humidity}%</Text>
                <Text style={styles.utilityQuadrantLabel}>Humidity</Text>
              </MotiView>
            </View>
          </View>
        </MotiView>

        {/* Two Column Grid for Weight & Utilities */}
        <View style={styles.cardsGrid}>
          {/* Weight Card */}
          <View style={[styles.gridCard, { backgroundColor: colors.Surface }]}>
            <View style={styles.cardIconHeader}>
              <MaterialCommunityIcons name="weight-kilogram" size={22} color={colors.Primary} />
            </View>
            <Text style={styles.gridCardLabel}>Current Weight</Text>
            <Text style={styles.gridCardValue}>{weightData.current} <Text style={styles.gridCardUnit}>lbs</Text></Text>
            <View style={styles.trendBadge}>
              <Ionicons name="arrow-down" size={14} color="#34C759" />
              <Text style={styles.trendText}>{Math.abs(parseFloat(weightData.change))} lbs</Text>
            </View>
          </View>

          {/* Utilities/Hydration Card */}
          <View style={[styles.gridCard, { backgroundColor: colors.Surface }]}>
            <View style={styles.cardIconHeader}>
              <Ionicons name="water" size={22} color="#0A84FF" />
            </View>
            <Text style={styles.gridCardLabel}>Hydration</Text>
            <Text style={styles.gridCardValue}>{utilityData.water} <Text style={styles.gridCardUnit}>/ {utilityData.waterGoal} gl</Text></Text>
            
            {/* Sleep Info inside Utilities */}
            <View style={styles.miniDivider} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="moon" size={14} color={colors.Primary} />
              <Text style={styles.utilitySubText}> {utilityData.sleep}</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  weatherCard: {
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherLocation: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 4,
  },
  weatherTemp: {
    color: '#000',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  weatherCondition: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  activityCard: {
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitleWhite: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  progressInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsInfo: {
    flex: 1,
  },
  statMainWhite: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statSubWhite: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  statMetaWhite: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  gridCard: {
    width: '47%',
    borderRadius: 32,
    padding: 20,
    minHeight: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardIconHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.Background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridCardLabel: {
    color: colors.TextSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridCardValue: {
    color: colors.TextTitle,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  gridCardUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.TextSecondary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  miniDivider: {
    height: 1,
    backgroundColor: colors.Border,
    marginVertical: 8,
  },
  utilitySubText: {
    color: colors.TextTitle,
    fontSize: 14,
    fontWeight: '600',
  },
  utilityCardContainer: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 32,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    aspectRatio: 1, // Make it square
    marginBottom: 16,
  },
  utilityLeftColumn: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  utilityRightColumn: {
    flex: 1,
    gap: 12,
  },
  utilityQuadrant: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'center',
  },
  utilityTempContent: {
    padding: 20,
    zIndex: 2,
  },
  utilityTempText: {
    fontSize: 42,
    fontWeight: '500',
    color: '#737373',
    letterSpacing: -1,
  },
  utilityTempLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#999999',
    marginTop: 4,
  },
  utilityTempFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#CFCFCF',
    zIndex: 1,
  },
  utilityTempPill: {
    position: 'absolute',
    alignSelf: 'center',
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A3A3A3',
    zIndex: 3,
    transform: [{ translateY: 2 }],
  },
  utilityQuadrantValue: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFF',
  },
  utilityQuadrantLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  utilityHumidityFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#7CB9E8',
    zIndex: 1,
  },
});
