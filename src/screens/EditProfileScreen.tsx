import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-remix-icon';
import { MotiView } from 'moti';
import * as ImagePicker from 'expo-image-picker';
import { useThemeColors } from '../theme/colors';
import { useProfileStore } from '../store/useProfileStore';

export const EditProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const profile = useProfileStore();
  
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);
  const [age, setAge] = useState(profile.age);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    Keyboard.dismiss();
    profile.updateProfile({
      name,
      email,
      avatarUri,
      age,
      height,
      weight,
    });
    navigation.goBack();
  };

  const renderInput = (
    label: string, 
    value: string, 
    onChange: (text: string) => void, 
    key: string,
    keyboardType: any = 'default',
    placeholder = ''
  ) => {
    const isFocused = focusedInput === key;
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={colors.TextMuted}
          onFocus={() => setFocusedInput(key)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-left-line" size={28} color={colors.TextTitle} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerSaveButton, !name.trim() && { opacity: 0.4 }]}
            onPress={handleSave}
            disabled={!name.trim()}
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
          style={styles.avatarSection}
        >
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton} onPress={handlePickImage} activeOpacity={0.8}>
              <Icon name="camera-fill" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarTitle}>Profile Photo</Text>
        </MotiView>

        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', duration: 400, delay: 150 }}
          style={styles.card}
        >
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(160, 180, 245, 0.1)' }]}>
              <Icon name="user-3-fill" size={20} color={colors.CardBlue} />
            </View>
            <Text style={styles.sectionTitle}>Personal Info</Text>
          </View>

          {renderInput('Full Name', name, setName, 'name', 'default', 'e.g. Mark Parker')}
          {renderInput('Email Address', email, setEmail, 'email', 'email-address', 'e.g. mark@example.com')}
        </MotiView>

        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', duration: 400, delay: 250 }}
          style={styles.card}
        >
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
              <Icon name="body-scan-fill" size={20} color={colors.Success || '#34C759'} />
            </View>
            <Text style={styles.sectionTitle}>Physical Details</Text>
          </View>

          {renderInput('Age', age, setAge, 'age', 'number-pad', 'e.g. 24')}
          {renderInput('Height', height, setHeight, 'height', 'default', 'e.g. 175 cm')}
          {renderInput('Weight', weight, setWeight, 'weight', 'default', 'e.g. 70 kg')}
        </MotiView>
      </KeyboardAwareScrollView>
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
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.Surface,
    borderRadius: 22,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.SurfaceVariant,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.CardOrange,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.Background,
  },
  avatarTitle: {
    color: colors.TextTitle,
    fontSize: 16,
    fontWeight: '600',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  inputContainer: {
    marginBottom: 20,
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
    borderColor: colors.CardBlue,
    backgroundColor: colors.SurfaceVariant,
  },
});
