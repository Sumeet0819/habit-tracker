import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { useThemeColors } from '../theme/colors';

const ITEM_HEIGHT = 48;

const WheelPicker = ({ data, selectedValue, onValueChange, colors }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const paddedData = ['', '', ...data, '', ''];

  useEffect(() => {
    const index = data.findIndex((d: any) => d === selectedValue);
    if (index !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: false });
      }, 50);
    }
  }, []); // Only run once on mount

  const handleScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      onValueChange(data[index]);
    }
  };

  return (
    <View style={{ height: ITEM_HEIGHT * 5, width: 80, position: 'relative' }}>
      <View style={{
        position: 'absolute',
        top: ITEM_HEIGHT * 2,
        height: ITEM_HEIGHT,
        width: '100%',
        backgroundColor: colors.SurfaceVariant,
        borderRadius: 12,
        zIndex: -1,
      }} />
      <FlatList
        ref={flatListRef}
        data={paddedData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        renderItem={({ item }) => {
          const isSelected = item === selectedValue;
          return (
            <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ 
                fontSize: isSelected ? 24 : 18, 
                fontWeight: isSelected ? '700' : '500',
                color: isSelected ? colors.TextTitle : colors.TextMuted,
                opacity: item === '' ? 0 : 1
              }}>
                {item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

interface CustomTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (date: Date) => void;
  initialDate: Date;
  title?: string;
}

export const CustomTimePicker = ({ visible, onClose, onSave, initialDate, title = "Select Time" }: CustomTimePickerProps) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const hoursData = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutesData = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periodData = ['AM', 'PM'];

  const initialHours24 = initialDate.getHours();
  const initialHours12 = initialHours24 % 12 || 12;
  const initialPeriod = initialHours24 >= 12 ? 'PM' : 'AM';

  const [selectedHour, setSelectedHour] = useState(initialHours12.toString().padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(initialDate.getMinutes().toString().padStart(2, '0'));
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  // Update state when initialDate changes and modal becomes visible
  useEffect(() => {
    if (visible) {
      const h24 = initialDate.getHours();
      setSelectedHour((h24 % 12 || 12).toString().padStart(2, '0'));
      setSelectedMinute(initialDate.getMinutes().toString().padStart(2, '0'));
      setSelectedPeriod(h24 >= 12 ? 'PM' : 'AM');
    }
  }, [visible, initialDate]);

  const handleSave = () => {
    const newDate = new Date(initialDate);
    let h24 = parseInt(selectedHour, 10);
    if (selectedPeriod === 'PM' && h24 !== 12) h24 += 12;
    if (selectedPeriod === 'AM' && h24 === 12) h24 = 0;
    
    newDate.setHours(h24, parseInt(selectedMinute, 10), 0, 0);
    onSave(newDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.pickerContainer}>
            <WheelPicker data={hoursData} selectedValue={selectedHour} onValueChange={setSelectedHour} colors={colors} />
            <Text style={styles.colon}>:</Text>
            <WheelPicker data={minutesData} selectedValue={selectedMinute} onValueChange={setSelectedMinute} colors={colors} />
            <View style={{ width: 10 }} />
            <WheelPicker data={periodData} selectedValue={selectedPeriod} onValueChange={setSelectedPeriod} colors={colors} />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={styles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
              <Text style={styles.buttonTextSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    backgroundColor: colors.Surface,
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: colors.TextTitle,
    fontSize: 20,
    fontWeight: '700',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT * 5,
  },
  colon: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.TextTitle,
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  buttonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.SurfaceVariant,
    alignItems: 'center',
  },
  buttonSave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.CardOrange,
    alignItems: 'center',
  },
  buttonTextCancel: {
    color: colors.TextTitle,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSave: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
